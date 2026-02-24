"use client";

import * as React from "react";
import { useConnection } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import type { MinterType } from "@/lib/types";
import { useDeployMinter } from "@/lib/hooks/useDeployMinter";
import {
  validateAddress,
  validateAdmin,
  validatePositiveNumber,
  validateStartTime,
  validateExpirationTime,
  validateDurationSeconds,
} from "@/lib/utils";
import {
  AddressField,
  NumberField,
  DateTimeField,
  DurationField,
  DeployProgressModal,
} from "./index";

type DeployFormProps = {
  type: MinterType;
  /** Prefill admin from URL (e.g. ?admin=0x...). */
  initialAdmin?: string;
  /** Prefill mintable from URL (e.g. ?mintable=0x... from "Deploy another" with previous deploy). */
  initialMintable?: string;
};

const primaryButtonClass =
  "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50";

export function DeployForm({ type, initialAdmin, initialMintable }: DeployFormProps) {
  const { isConnected, address: walletAddress } = useConnection();
  const { openConnectModal } = useConnectModal();
  const { deploy, isPending, error: deployError, step: deployStep } = useDeployMinter(type);

  const [mintable, setMintable] = React.useState(initialMintable ?? "");
  const [admin, setAdmin] = React.useState(initialAdmin ?? "");
  const [deployedAddress, setDeployedAddress] = React.useState<string | null>(null);
  const [cap, setCap] = React.useState("");
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [expirationTime, setExpirationTime] = React.useState<number | null>(null);
  const [mintDelay, setMintDelay] = React.useState(0);
  const [mintRateLimit, setMintRateLimit] = React.useState("");
  const [rateLimitWindow, setRateLimitWindow] = React.useState(0);

  React.useEffect(() => {
    if (initialMintable != null) setMintable(initialMintable);
  }, [initialMintable]);

  React.useEffect(() => {
    if (initialAdmin != null) setAdmin(initialAdmin);
  }, [initialAdmin]);

  // Auto-fill admin with connected wallet when available
  React.useEffect(() => {
    if (walletAddress) setAdmin(walletAddress);
  }, [walletAddress]);

  /** Only show validation errors after a field is touched or user attempted submit. */
  const [touched, setTouched] = React.useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = React.useState(false);
  const [progressOpen, setProgressOpen] = React.useState(false);

  const now = Math.floor(Date.now() / 1000);

  const touch = React.useCallback((field: string) => {
    setTouched((prev) => (prev.has(field) ? prev : new Set(prev).add(field)));
  }, []);

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);

      const mintableHex = mintable.trim() as `0x${string}`;
      const adminHex = admin.trim() as `0x${string}`;
      const params =
        type === "capped-v3" || type === "capped-v2"
          ? {
              mintable: mintableHex,
              admin: adminHex,
              cap: BigInt(cap),
              startTime: startTime!,
              expirationTime: expirationTime!,
            }
          : type === "delay"
            ? {
                mintable: mintableHex,
                admin: adminHex,
                mintDelay,
              }
            : {
                mintable: mintableHex,
                admin: adminHex,
                mintRateLimit: BigInt(mintRateLimit),
                mintRateLimitWindow: rateLimitWindow,
              };

      setProgressOpen(true);
      setDeployedAddress(null);
      const addr = await deploy(params);
      if (addr) {
        setDeployedAddress(addr);
      }
    },
    [
      type,
      mintable,
      admin,
      cap,
      startTime,
      expirationTime,
      mintDelay,
      mintRateLimit,
      rateLimitWindow,
      deploy,
    ]
  );

  const errors = React.useMemo(() => {
    const mintableError = validateAddress(mintable);
    const adminError = validateAdmin(admin);

    let capError: string | undefined;
    let startTimeError: string | undefined;
    let expirationTimeError: string | undefined;
    let mintDelayError: string | undefined;
    let mintRateLimitError: string | undefined;
    let rateLimitWindowError: string | undefined;

    if (type === "capped-v3" || type === "capped-v2") {
      capError = validatePositiveNumber(cap);
      startTimeError = validateStartTime(startTime, now);
      expirationTimeError = validateExpirationTime(expirationTime, startTime);
    } else if (type === "delay") {
      mintDelayError = validateDurationSeconds(mintDelay);
    } else if (type === "rate-limit") {
      mintRateLimitError = validatePositiveNumber(mintRateLimit);
      rateLimitWindowError = validateDurationSeconds(rateLimitWindow);
    }

    return {
      mintable: mintableError,
      admin: adminError,
      cap: capError,
      startTime: startTimeError,
      expirationTime: expirationTimeError,
      mintDelay: mintDelayError,
      mintRateLimit: mintRateLimitError,
      rateLimitWindow: rateLimitWindowError,
    };
  }, [
    type,
    mintable,
    admin,
    cap,
    startTime,
    expirationTime,
    mintDelay,
    mintRateLimit,
    rateLimitWindow,
    now,
  ]);

  const isFormValid = React.useMemo(() => {
    if (errors.mintable ?? errors.admin) return false;
    if (type === "capped-v3" || type === "capped-v2") {
      if (errors.cap ?? errors.startTime ?? errors.expirationTime) return false;
    } else if (type === "delay") {
      if (errors.mintDelay) return false;
    } else if (type === "rate-limit") {
      if (errors.mintRateLimit ?? errors.rateLimitWindow) return false;
    }
    return true;
  }, [type, errors]);

  const showError = React.useCallback(
    (field: string) => ((touched.has(field) || submitted) ? errors[field as keyof typeof errors] : undefined),
    [touched, submitted, errors]
  );

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <AddressField
        label="Mintable address"
        value={mintable}
        onChange={setMintable}
        onBlur={() => touch("mintable")}
        error={showError("mintable")}
        required
      />
      <AddressField
        label="Admin address"
        value={admin}
        onChange={setAdmin}
        onBlur={() => touch("admin")}
        error={showError("admin")}
        required
      />

      {(type === "capped-v3" || type === "capped-v2") && (
        <>
          <NumberField
            label="Cap"
            value={cap}
            onChange={setCap}
            onBlur={() => touch("cap")}
            placeholder="e.g. 1000"
            error={showError("cap")}
            required
          />
          <DateTimeField
            label="Start time"
            value={startTime}
            onChange={setStartTime}
            onBlur={() => touch("startTime")}
            minTimestamp={now}
            error={showError("startTime")}
            required
          />
          <DateTimeField
            label="Expiration time"
            value={expirationTime}
            onChange={setExpirationTime}
            onBlur={() => touch("expirationTime")}
            minTimestamp={startTime ?? undefined}
            error={showError("expirationTime")}
            required
          />
        </>
      )}

      {type === "delay" && (
        <DurationField
          label="Mint delay"
          value={mintDelay}
          onChange={setMintDelay}
          onBlur={() => touch("mintDelay")}
          error={showError("mintDelay")}
          required
        />
      )}

      {type === "rate-limit" && (
        <>
          <NumberField
            label="Mint rate limit"
            value={mintRateLimit}
            onChange={setMintRateLimit}
            onBlur={() => touch("mintRateLimit")}
            placeholder="e.g. 100"
            error={showError("mintRateLimit")}
            required
          />
          <DurationField
            label="Rate limit window"
            value={rateLimitWindow}
            onChange={setRateLimitWindow}
            onBlur={() => touch("rateLimitWindow")}
            error={showError("rateLimitWindow")}
            required
          />
        </>
      )}

      {!isConnected ? (
        <button
          type="button"
          className={primaryButtonClass}
          onClick={() => openConnectModal?.()}
        >
          Connect wallet
        </button>
      ) : (
        <button
          type="submit"
          className={primaryButtonClass}
          disabled={!isFormValid || isPending}
        >
          {isPending ? "Deploying…" : "Deploy"}
        </button>
      )}

      <DeployProgressModal
        open={progressOpen}
        onOpenChange={setProgressOpen}
        type={type}
        deployedAddress={deployedAddress}
        adminAddress={admin}
        walletAddress={walletAddress}
        error={deployError}
        deployStep={deployStep}
        isDeploying={isPending}
      />
    </form>
  );
}
