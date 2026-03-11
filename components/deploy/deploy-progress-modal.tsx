"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, X, ChevronLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useChainId, useChains } from "wagmi";
import {
  cn,
  truncateAddress,
  getBlockExplorerAddressUrl,
} from "@/lib/utils";
import type { MinterType } from "@/lib/types";
import { DeployStep, DEPLOY_STEP_COUNT } from "@/lib/hooks/useDeployMinter";

const DEPLOY_ITEMS: {
  type: MinterType;
  label: string;
}[] = [
  { type: "capped-v3", label: "Capped Minter V3" },
  // { type: "capped-v2", label: "Capped Minter V2" },
  { type: "delay", label: "Delay Minter Mod" },
  { type: "rate-limit", label: "Rate Limit Mod" },
];

function getModLabel(type: string | undefined): string {
  return DEPLOY_ITEMS.find((i) => i.type === type)?.label ?? "Minter";
}

function getStepLabel(
  index: number,
  isComplete: boolean,
  opts: {
    type: string | undefined;
    modLabel: string;
    network: string;
    walletAddress: string | undefined;
    deployedAddress: string | null | undefined;
  }
): string {
  const { modLabel, network, walletAddress, deployedAddress } = opts;
  switch (index) {
    case 0:
      if (!isComplete) return "Confirm in your wallet";
      return walletAddress
        ? `Confirmed via wallet ${truncateAddress(walletAddress)}`
        : "Confirmed in your wallet";
    case 1:
      if (!isComplete) return `Deploying ${modLabel} to ${network}`;
      return deployedAddress
        ? `Deployed at ${truncateAddress(deployedAddress)}`
        : "Deployed";
    case 2:
      return isComplete ? "Data indexed" : "Indexing Data";
    default:
      return "";
  }
}

function randomDelay(minMs: number, maxMs: number): number {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

function getFriendlyErrorMessage(
  error: Error,
  failureIndex: number | null
): string {
  const raw = error?.message ?? String(error);
  const lower = raw.toLowerCase();

  if (lower.includes("user rejected") || lower.includes("user denied")) {
    return "User rejected the transaction in their wallet.";
  }

  if (failureIndex === DeployStep.Deploying) {
    return "Transaction failed.";
  }

  return "Something went wrong. Please try again.";
}

export type DeployProgressModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: string;
  /** Deployed contract address (mock until real deployment). */
  deployedAddress?: string | null;
  /** Mintable token or mod address this deployment is attached to (for Grant Minter Role CTA). */
  mintableAddress?: string;
  /** Admin address used for this deploy (for "Deploy another" prefill). */
  adminAddress: string;
  /** Connected wallet address (for "Confirmed via wallet" step). */
  walletAddress?: string | undefined;
  /** When set, the failed step (e.g. Deploying) shows a red X. */
  error?: Error | null;
  /** Current deploy step from useDeployMinter. When isDeploying, modal uses this instead of timer. */
  deployStep?: number;
  /** When true, progress is driven by deployStep; timer is disabled. */
  isDeploying?: boolean;
};

export function DeployProgressModal({
  open,
  onOpenChange,
  type,
  deployedAddress,
  mintableAddress,
  adminAddress, // kept for API; passed by DeployForm for "Deploy another" prefill
  walletAddress,
  error,
  deployStep = DeployStep.ConfirmWallet,
  isDeploying = false,
}: DeployProgressModalProps) {
  void adminAddress;
  const chainId = useChainId();
  const chains = useChains();
  const network =
    chains?.find((c) => c.id === chainId)?.name ?? "Unknown network";
  const [activeIndex, setActiveIndex] = React.useState(0);
  const modLabel = getModLabel(type);

  // When deploy is in progress, use deployStep; when done with address, show all complete; else use local timer or error state
  const failureIndex = error != null ? Math.min(deployStep, DEPLOY_STEP_COUNT - 1) : null;
  const resolvedIndex =
    failureIndex != null
      ? failureIndex
      : isDeploying
        ? Math.min(deployStep, DEPLOY_STEP_COUNT)
        : deployedAddress
          ? DEPLOY_STEP_COUNT
          : activeIndex;
  const isDone = resolvedIndex >= DEPLOY_STEP_COUNT;

  React.useEffect(() => {
    if (!open) {
      setActiveIndex(0);
      return;
    }
  }, [open]);

  React.useEffect(() => {
    if (error != null || isDeploying || deployedAddress) return;
    if (!open || activeIndex >= DEPLOY_STEP_COUNT) return;

    const delay = randomDelay(800, 1800);
    const t = setTimeout(() => {
      setActiveIndex((i) => Math.min(i + 1, DEPLOY_STEP_COUNT));
    }, delay);

    return () => clearTimeout(t);
  }, [open, activeIndex, error, isDeploying, deployedAddress]);

  const router = useRouter();
  const deployAnotherHref = (t: MinterType) =>
    deployedAddress
      ? `/deploy/${t}?mintable=${encodeURIComponent(deployedAddress)}`
      : `/deploy/${t}`;

  const handleDeployAnother = (t: MinterType) => {
    onOpenChange(false);
    router.push(deployAnotherHref(t));
  };

  const handleGrantMinterRole = () => {
    if (!deployedAddress || !mintableAddress) return;
    onOpenChange(false);
    const from = encodeURIComponent(mintableAddress);
    const to = encodeURIComponent(deployedAddress);
    router.push(`/grant-role?from=${from}&to=${to}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center mb-4">Deploy {modLabel}</DialogTitle>
        </DialogHeader>
        <ul className="space-y-3" role="list" aria-label="Deployment progress">
          {Array.from({ length: DEPLOY_STEP_COUNT }, (_, index) => {
            const isComplete = index < resolvedIndex;
            const isActive = index === resolvedIndex;
            const isFailed = error != null && index === failureIndex;
            const label = getStepLabel(index, isComplete && !isFailed, {
              type,
              modLabel,
              network,
              walletAddress,
              deployedAddress,
            });
            const showAddressLink =
              index === 1 && isComplete && deployedAddress && !error;

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
                  {showAddressLink ? (
                    <>
                      Deployed at{" "}
                      <a
                        href={getBlockExplorerAddressUrl(deployedAddress)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono underline underline-offset-2 hover:opacity-80"
                      >
                        {truncateAddress(deployedAddress)}
                      </a>
                    </>
                  ) : isFailed && error ? (
                    getFriendlyErrorMessage(error, failureIndex)
                  ) : (
                    label
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        {(isDone && deployedAddress) || error ? (
          <div className="flex flex-col items-center gap-3 border-t pt-4">
            {error ? (
              <>
                <Link
                  href="/"
                  className="text-xs text-muted-foreground underline-offset-2 hover:opacity-80 flex mt-1"
                >
                  <ChevronLeft className="size-3 shrink-0 mt-0.5 pr-1" />
                  Back to dashboard
                </Link>
              </>
            ) : (
              <>
                {/* Other minter types (exclude the one we just deployed) */}
                {isDone && deployedAddress && type && (
                  <>
                    <p className="text-center text-sm text-muted-foreground">
                      Deploy and link another capped minter or mod to this deployment
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {DEPLOY_ITEMS.filter((item) => item.type !== type).map(
                        ({ type: t, label }) => (
                          <Button
                            key={t}
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => handleDeployAnother(t)}
                          >
                            {label}
                          </Button>
                        )
                      )}
                    </div>
                  </>
                )}
                {isDone && deployedAddress && mintableAddress && (
                  <div className="mt-4 flex flex-col items-center gap-2 text-center">
                    <p className="text-sm text-muted-foreground">
                      You can now grant the minter role from your token or minter
                      contract to this newly deployed contract.
                    </p>
                    <Button size="sm" onClick={handleGrantMinterRole}>
                      Grant Minter Role
                    </Button>
                  </div>
                )}
                <Link
                  href={
                    deployedAddress
                      ? `/?minter=${encodeURIComponent(deployedAddress)}`
                      : "/"
                  }
                  className="text-sm font-medium text-primary underline-offset-2 hover:opacity-80 flex mt-4"
                >
                  <ChevronLeft className="size-4 shrink-0 mt-0.5 pr-1" />
                  Back to dashboard
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="flex justify-center border-t pt-4">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
              aria-hidden
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
