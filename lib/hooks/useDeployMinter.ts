"use client";

import { useState, useCallback } from "react";
import type { DeployMinterParams, MinterType } from "@/lib/types";

/** 0 = confirm wallet, 1 = deploying (tx sent/mining), 2 = indexing (tx mined), 3 = done */
export type DeployStep = 0 | 1 | 2 | 3;

export type UseDeployMinterReturn = {
  /** Deploy the minter; returns deployed contract address or null on failure. */
  deploy: (params: DeployMinterParams) => Promise<string | null>;
  isPending: boolean;
  error: Error | null;
  /** Current step (0–3). Drive modal progress from this when isPending is true. */
  step: DeployStep;
};

export function useDeployMinter(type: MinterType): UseDeployMinterReturn {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [step, setStep] = useState<DeployStep>(0);

  const deploy = useCallback(
    async (params: DeployMinterParams): Promise<string | null> => {
      setIsPending(true);
      setError(null);
      setStep(0);
      try {
        // -------- MOCK: comment out this block and add real logic below --------
        setStep(1);
        await new Promise((r) => setTimeout(r, 1200));
        setStep(2);
        await new Promise((r) => setTimeout(r, 1500));
        setStep(3);
        await new Promise((r) => setTimeout(r, 800));
        const mockBytes = new Uint8Array(20);
        if (typeof crypto !== "undefined" && crypto.getRandomValues) {
          crypto.getRandomValues(mockBytes);
        }
        const mockAddress =
          "0x" +
          Array.from(mockBytes)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        return mockAddress;
        // -------- END MOCK --------

        // TODO: Real deployment — comment out the MOCK block above and implement here:
        // 1. Build the transaction (factory address, deploy calldata per type)
        // 2. Set nonce, gas limit, gas price / maxFeePerGas
        // 3. Send the transaction (writeContract / sendTransaction), get tx hash → setStep(1)
        // 4. Wait for receipt, parse deployed address from logs/receipt → setStep(2)
        // 5. Optionally wait for indexing → setStep(3), then return the address
        void type;
        void params;
        return null;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        return null;
      } finally {
        setIsPending(false);
      }
    },
    [type]
  );

  return { deploy, isPending, error, step };
}
