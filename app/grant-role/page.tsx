"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useWalletClient, usePublicClient } from "wagmi";
import { toast } from "sonner";
import { isAddress } from "viem";
import { Button } from "@/components/ui/button";
import { AddressField } from "@/components/deploy/address-field";
import { accessControlAbi, MINTER_ROLE } from "@/lib/abis/accessControl";
import {
  GrantProgressModal,
  GrantStep,
  type GrantStep as GrantStepType,
} from "@/components/grant/grant-progress-modal";

export default function GrantRolePage() {
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from") ?? "";
  const toParam = searchParams.get("to") ?? "";

  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [fromAddress, setFromAddress] = useState(fromParam);
  const [toAddress, setToAddress] = useState(toParam);
  const [isPending, setIsPending] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [step, setStep] = useState<GrantStepType>(GrantStep.ConfirmWallet);
  const [error, setError] = useState<Error | null>(null);

  const fromError =
    fromAddress && !isAddress(fromAddress)
      ? "Invalid contract address"
      : undefined;
  const toError =
    toAddress && !isAddress(toAddress) ? "Invalid minter address" : undefined;
  const canSubmit =
    !!walletClient?.account &&
    isAddress(fromAddress) &&
    isAddress(toAddress) &&
    !isPending;

  const grant = useCallback(async () => {
    if (
      !walletClient?.account ||
      !isAddress(fromAddress) ||
      !isAddress(toAddress)
    )
      return;
    if (!publicClient) {
      toast.error("Grant failed", {
        description: "Chain not available. Please check your network.",
      });
      return;
    }

    setIsPending(true);
    setError(null);
    setStep(GrantStep.ConfirmWallet);
    setProgressOpen(true);

    try {
      const hash = await walletClient.writeContract({
        address: fromAddress as `0x${string}`,
        abi: accessControlAbi,
        functionName: "grantRole",
        args: [MINTER_ROLE, toAddress as `0x${string}`],
        account: walletClient.account,
      });

      setStep(GrantStep.Granting);

      await publicClient.waitForTransactionReceipt({ hash });

      setStep(GrantStep.Done);
      toast.success("Minter role granted", {
        description:
          "Transaction confirmed. The minter role has been granted successfully.",
      });
      setToAddress("");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(new Error(message));
      toast.error("Grant failed", { description: message });
    } finally {
      setIsPending(false);
    }
  }, [walletClient, publicClient, fromAddress, toAddress]);

  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <h1 className="text-xl font-semibold text-foreground">
        Grant Minter Role
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Grant <code>MINTER_ROLE</code> from a token or mod contract to a
        minter mod. Use this after deploying a mod so it can mint, or when
        chaining mods together.
      </p>
      <div className="mt-6 space-y-4">
        <AddressField
          label="From contract (token or mod) address"
          value={fromAddress}
          onChange={setFromAddress}
          error={fromError}
          placeholder="0x..."
        />
        <AddressField
          label="To minter (mod) address"
          value={toAddress}
          onChange={setToAddress}
          error={toError}
          placeholder="0x..."
        />
        <Button onClick={grant} disabled={!canSubmit} className="mt-2">
          {isPending ? "Granting…" : "Grant Minter Role"}
        </Button>
      </div>
      {!walletClient?.account && (
        <p className="mt-4 text-sm text-muted-foreground">
          Connect your wallet to grant the role (you must have the admin role
          on the contract you are granting from).
        </p>
      )}

      <GrantProgressModal
        open={progressOpen}
        onOpenChange={setProgressOpen}
        step={step}
        error={error}
        walletAddress={walletClient?.account?.address}
        fromAddress={fromAddress}
        toAddress={toAddress}
      />
    </main>
  );
}

