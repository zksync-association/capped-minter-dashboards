"use client";

import { useState, useCallback } from "react";
import { useWalletClient, usePublicClient } from "wagmi";
import { parseEventLogs, zeroAddress, type Log } from "viem";
import { toast } from "sonner";
import type {
  DeployMinterParams,
  DeployCappedParams,
  DeployDelayParams,
  DeployRateLimitParams,
  MinterType,
} from "@/lib/types";
import { getFactoryAddress } from "@/lib/contracts";
import { pollUntilMinterIndexed } from "@/lib/subgraph/client";
import { getBlockExplorerAddressUrl, truncateAddress } from "@/lib/utils";
import { zkCappedMinterV3FactoryAbi } from "@/lib/abis/zkCappedMinterV3Factory";
import { zkCappedMinterV2FactoryAbi } from "@/lib/abis/zkCappedMinterV2Factory";
import { zkMinterDelayV1FactoryAbi } from "@/lib/abis/zkMinterDelayV1Factory";
import { zkMinterRateLimiterV1FactoryAbi } from "@/lib/abis/zkMinterRateLimiterV1Factory";
import { useDeployProgressStore } from "@/lib/stores/deployProgressStore";

/** Named steps for deploy flow; numeric values drive modal progress (0–3). */
export const DeployStep = {
  ConfirmWallet: 0,
  Deploying: 1,
  Indexing: 2,
  Done: 3,
} as const;

export type DeployStep = (typeof DeployStep)[keyof typeof DeployStep];

/** Number of progress items shown in the modal (steps 0–2); step 3 = done. */
export const DEPLOY_STEP_COUNT = DeployStep.Done;

export const DEPLOY_PROGRESS_EVENT_NAME = "capped-minter-open-progress-modal";

export type ActiveDeployStorage = {
  type: MinterType;
  startedAt: number;
  step: DeployStep;
};

export type UseDeployMinterReturn = {
  /** Deploy the minter; returns deployed contract address or null on failure. */
  deploy: (params: DeployMinterParams) => Promise<string | null>;
  isPending: boolean;
  error: Error | null;
  /** Current step. Drive modal progress from this when isPending is true. */
  step: DeployStep;
};


type CreateMinterWriteContractParams = {
  address: `0x${string}`;
  abi: readonly unknown[];
  functionName: string;
  args: readonly unknown[];
  /** Event name to parse deployed address from receipt logs. */
  creationEventName: string;
};

/**
 * Returns the parameters for a single writeContract call to the factory's createMinter (or createCappedMinter).
 * Pure function of type, params, factory address, and salt — easy to test and reuse.
 */
function getCreateMinterWriteContractParams(
  type: MinterType,
  params: DeployMinterParams,
  factoryAddress: `0x${string}`,
  salt: bigint
): CreateMinterWriteContractParams {
  if (type === "capped-v3") {
    const p = params as DeployCappedParams;
    return {
      address: factoryAddress,
      abi: zkCappedMinterV3FactoryAbi,
      functionName: "createMinter",
      args: [
        p.mintable,
        p.admin,
        p.cap,
        p.startTime,
        p.expirationTime,
        salt,
      ],
      creationEventName: "MinterCappedCreated",
    };
  }
  if (type === "capped-v2") {
    const p = params as DeployCappedParams;
    return {
      address: factoryAddress,
      abi: zkCappedMinterV2FactoryAbi,
      functionName: "createCappedMinter",
      args: [
        p.mintable,
        p.admin,
        p.cap,
        p.startTime,
        p.expirationTime,
        salt,
      ],
      creationEventName: "CappedMinterV2Created",
    };
  }
  if (type === "delay") {
    const p = params as DeployDelayParams;
    return {
      address: factoryAddress,
      abi: zkMinterDelayV1FactoryAbi,
      functionName: "createMinter",
      args: [p.mintable, p.admin, p.mintDelay, salt],
      creationEventName: "MinterDelayCreated",
    };
  }
  const p = params as DeployRateLimitParams;
  return {
    address: factoryAddress,
    abi: zkMinterRateLimiterV1FactoryAbi,
    functionName: "createMinter",
    args: [
      p.mintable,
      p.admin,
      p.mintRateLimit,
      p.mintRateLimitWindow,
      salt,
    ],
    creationEventName: "MinterRateLimiterCreated",
  };
}

/** Event arg names for the deployed-address field per factory creation event. */
const DEPLOYED_ADDRESS_ARG_NAMES = [
  "cappedMinter",
  "minterAddress",
  "minterDelay",
  "minterRateLimiter",
] as const;

type DeployedAddressEventArgs = Partial<
  Record<(typeof DEPLOYED_ADDRESS_ARG_NAMES)[number], string>
>;

/**
 * Parses the transaction receipt logs for the factory creation event and returns the deployed contract address.
 * Pure function — easy to test. Throws if the event or address is not found.
 */
export function getDeployedAddressFromReceipt(
  receipt: { logs: unknown[] },
  abi: readonly unknown[],
  creationEventName: string
): string {
  const parsed = parseEventLogs({
    abi,
    logs: receipt.logs as Log[],
  }) as unknown as Array<{ eventName: string; args?: Record<string, unknown> }>;
  const creationLog = parsed.find((e) => e.eventName === creationEventName);
  const eventArgs = creationLog?.args as DeployedAddressEventArgs | undefined;
  if (!eventArgs) {
    throw new Error("Deployed address not found in transaction logs");
  }
  const deployedAddress = DEPLOYED_ADDRESS_ARG_NAMES.map(
    (name) => eventArgs[name]
  ).find((v): v is string => typeof v === "string");
  if (!deployedAddress) {
    throw new Error("Deployed address not found in transaction logs");
  }
  return deployedAddress;
}

export function useDeployMinter(type: MinterType): UseDeployMinterReturn {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [step, setStep] = useState<DeployStep>(DeployStep.ConfirmWallet);

  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const deploy = useCallback(
    async (params: DeployMinterParams): Promise<string | null> => {
      setIsPending(true);
      setError(null);
      setStep(DeployStep.ConfirmWallet);
      const startedAt = Date.now();
      useDeployProgressStore.getState().setActiveDeploy({
        type,
        startedAt,
        step: DeployStep.ConfirmWallet,
      });

      try {
        if (!walletClient?.account) {
          throw new Error("Wallet not connected");
        }
        if (!publicClient) {
          throw new Error("Chain not available");
        }

        const chainId = publicClient.chain?.id;
        if (chainId == null) {
          throw new Error("Chain ID not available");
        }

        const factoryAddress = getFactoryAddress(type, chainId);
        if (
          !factoryAddress ||
          factoryAddress.toLowerCase() === zeroAddress.toLowerCase()
        ) {
          throw new Error(`Factory not deployed for ${type} on this chain`);
        }

        // Salt is set to the current timestamp to ensure a unique address for each deployment.
        const salt = BigInt(Date.now());
        
        const { address, abi, functionName, args, creationEventName } =
          getCreateMinterWriteContractParams(type, params, factoryAddress, salt);

        const hash = await walletClient.writeContract({
          address,
          abi,
          functionName,
          args,
          account: walletClient.account,
        });

        setStep(DeployStep.Deploying);
        useDeployProgressStore.getState().setActiveDeploy({
          type,
          startedAt,
          step: DeployStep.Deploying,
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        setStep(DeployStep.Indexing);
        useDeployProgressStore.getState().setActiveDeploy({
          type,
          startedAt,
          step: DeployStep.Indexing,
        });

        const deployedAddress = getDeployedAddressFromReceipt(
          receipt,
          abi,
          creationEventName
        );

        if (process.env.NEXT_PUBLIC_SUBGRAPH_URL) {
          await pollUntilMinterIndexed(deployedAddress, {
            intervalMs: 2000,
            maxAttempts: 30,
          });
        }

        setStep(DeployStep.Done);
        useDeployProgressStore.getState().setActiveDeploy(null);

        const explorerUrl = getBlockExplorerAddressUrl(deployedAddress);
        toast.success("Minter deployed", {
          description: truncateAddress(deployedAddress),
          action: {
            label: "View on explorer",
            onClick: () => window.open(explorerUrl, "_blank"),
          },
        });

        return deployedAddress as `0x${string}`;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        // Sanitize error so React dev tools don't try to serialize BigInt-heavy objects from viem.
        setError(new Error(message));
        useDeployProgressStore.getState().setActiveDeploy(null);
        return null;
      } finally {
        setIsPending(false);
      }
    },
    [type, walletClient, publicClient]
  );

  return { deploy, isPending, error, step };
}
