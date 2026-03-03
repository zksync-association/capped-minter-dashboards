"use client";

import * as React from "react";
import { X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn, truncateAddress } from "@/lib/utils";

export const GrantStep = {
  ConfirmWallet: 0,
  Granting: 1,
  Done: 2,
} as const;

export type GrantStep = (typeof GrantStep)[keyof typeof GrantStep];

/** Number of progress items shown in the modal (steps 0–1); step 2 = done. */
export const GRANT_STEP_COUNT = GrantStep.Done;

function getStepLabel(
  index: number,
  isComplete: boolean,
  opts: {
    walletAddress?: string;
    fromAddress?: string;
    toAddress?: string;
  }
): string {
  const { walletAddress, fromAddress, toAddress } = opts;
  switch (index) {
    case 0:
      if (!isComplete) return "Confirm in your wallet";
      return walletAddress
        ? `Confirmed via wallet ${truncateAddress(walletAddress)}`
        : "Confirmed in your wallet";
    case 1: {
      const baseLabel = isComplete
        ? "Minter role granted"
        : "Granting minter role";
      if (!fromAddress || !toAddress) return baseLabel;
      const from = truncateAddress(fromAddress);
      const to = truncateAddress(toAddress);
      return `${baseLabel} from ${from} to ${to}`;
    }
    default:
      return "";
  }
}

function getFriendlyErrorMessage(error: Error): string {
  const raw = error?.message ?? String(error);
  const lower = raw.toLowerCase();

  if (lower.includes("user rejected") || lower.includes("user denied")) {
    return "User rejected the transaction in their wallet.";
  }

  if (lower.includes("insufficient") && lower.includes("fund")) {
    return "Insufficient funds to pay for gas.";
  }

  return "Something went wrong. Please try again.";
}

export type GrantProgressModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Current grant step. Drives modal progress. */
  step: GrantStep;
  /** Optional error to show instead of normal step labels. */
  error?: Error | null;
  /** Wallet address used to confirm the transaction. */
  walletAddress?: string;
  /** Contract the role is being granted from (token or mod). */
  fromAddress?: string;
  /** Address receiving the minter role (mod). */
  toAddress?: string;
};

export function GrantProgressModal({
  open,
  onOpenChange,
  step,
  error,
  walletAddress,
  fromAddress,
  toAddress,
}: GrantProgressModalProps) {
  const [localStep, setLocalStep] = React.useState<GrantStep>(
    GrantStep.ConfirmWallet
  );

  React.useEffect(() => {
    if (!open) {
      setLocalStep(GrantStep.ConfirmWallet);
      return;
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    setLocalStep(step);
  }, [step, open]);

  const failureIndex =
    error != null ? Math.min(step, GRANT_STEP_COUNT - 1) : null;
  const resolvedIndex =
    failureIndex != null
      ? failureIndex
      : Math.min(localStep, GRANT_STEP_COUNT);
  const isDone = resolvedIndex >= GRANT_STEP_COUNT;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center mb-4">
            Grant Minter Role
          </DialogTitle>
        </DialogHeader>
        <ul className="space-y-3" role="list" aria-label="Grant role progress">
          {Array.from({ length: GRANT_STEP_COUNT }, (_, index) => {
            const isComplete = index < resolvedIndex;
            const isActive = index === resolvedIndex;
            const isFailed = error != null && index === failureIndex;
            const label = getStepLabel(index, isComplete && !isFailed, {
              walletAddress,
              fromAddress,
              toAddress,
            });

            return (
              <li
                key={index}
                className={cn(
                  "flex items-center gap-3 text-sm",
                  isComplete && !isFailed && "text-muted-foreground",
                  (isActive || isFailed) && "text-foreground font-medium",
                  isFailed && "text-destructive"
                )}
              >
                <span
                  className="relative flex size-6 shrink-0 items-center justify-center"
                  aria-hidden
                >
                  {isFailed ? (
                    <span className="flex size-5 items-center justify-center rounded-full border-2 border-red-500 bg-red-500 text-white">
                      <X className="size-3" strokeWidth={2.5} />
                    </span>
                  ) : isComplete ? (
                    <span className="flex size-5 items-center justify-center rounded-full border-2 border-green-500 bg-green-500 text-white">
                      <Check className="size-3" strokeWidth={2.5} />
                    </span>
                  ) : isActive ? (
                    <>
                      <span
                        className="absolute size-2 rounded-full bg-green-500 animate-ping"
                        aria-hidden
                      />
                      <span className="relative size-2 rounded-full bg-green-500" />
                    </>
                  ) : (
                    <span className="size-2 rounded-full border-2 border-muted-foreground/40" />
                  )}
                </span>
                <span>
                  {isFailed && error ? getFriendlyErrorMessage(error) : label}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col items-center gap-3 border-t pt-4">
          {error ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          ) : isDone ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Done
            </Button>
          ) : (
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
              aria-hidden
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

