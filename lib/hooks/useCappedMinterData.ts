"use client";

import { useMemo } from "react";
import { useReadContracts } from "wagmi";
import { zkCappedMinterAbi } from "@/lib/abis/zkCappedMinter";
import type { ProgramConfig } from "@/lib/programs";
import { getChainId } from "@/lib/utils";
import { useMainnetProgramRoots } from "@/lib/hooks/useMainnetPrograms";
import { TESTNET_PROGRAM_ROOTS } from "@/data/programs.testnet";

export type ProgramStatus = "active" | "fullyUsed" | "expired";

export type ProgramRow = {
  name: string;
  proposalUrl: string;
  chainId: number;
  rootAddress: `0x${string}`;
  cap: bigint;
  minted: bigint;
  startTime: number;
  expirationTime: number;
  status: ProgramStatus;
};

/** Batch-read CAP, minted, START_TIME, EXPIRATION_TIME from all root capped minters via multicall. One row per root. */
export function useCappedMinterData(): {
  rows: ProgramRow[];
  isPending: boolean;
  error: Error | null;
} {
  const chainId = getChainId();
  const isMainnet = chainId === 324;

  const {
    programRoots: mainnetProgramRoots,
    isPending: isMainnetPending,
    error: mainnetError,
  } = useMainnetProgramRoots(isMainnet);

  const programRoots = isMainnet ? mainnetProgramRoots : TESTNET_PROGRAM_ROOTS;

  const contracts = useMemo(() => {
    const list: Array<{
      address: `0x${string}`;
      abi: typeof zkCappedMinterAbi;
      functionName: "CAP" | "minted" | "START_TIME" | "EXPIRATION_TIME";
      chainId: number;
    }> = [];
    for (const { rootAddress } of programRoots) {
      list.push(
        { address: rootAddress, abi: zkCappedMinterAbi, functionName: "CAP", chainId },
        { address: rootAddress, abi: zkCappedMinterAbi, functionName: "minted", chainId },
        { address: rootAddress, abi: zkCappedMinterAbi, functionName: "START_TIME", chainId },
        { address: rootAddress, abi: zkCappedMinterAbi, functionName: "EXPIRATION_TIME", chainId }
      );
    }
    return list;
  }, [programRoots, chainId]);

  const { data, isPending: isContractsPending, error: contractsError } = useReadContracts({
    contracts,
    query: {
      enabled:
        contracts.length > 0 &&
        (!isMainnet || (!isMainnetPending && !mainnetError)),
    },
  });

  const rows = useMemo((): ProgramRow[] => {
    if (!data || data.length !== programRoots.length * 4) return [];

    const nowSeconds = Math.floor(Date.now() / 1000);
    const statusRank: Record<ProgramStatus, number> = {
      active: 0,
      fullyUsed: 1,
      expired: 2,
    };

    const unsorted: ProgramRow[] = programRoots.map(
      (
        {
          program,
          rootAddress,
        }: { program: ProgramConfig; rootAddress: `0x${string}` },
        i: number
      ) => {
      const base = i * 4;
      const cap = (data[base]?.result ?? 0n) as bigint;
      const minted = (data[base + 1]?.result ?? 0n) as bigint;
      const startTime = Number((data[base + 2]?.result ?? 0n) as bigint);
      const expirationTime = Number((data[base + 3]?.result ?? 0n) as bigint);

      let status: ProgramStatus;
      if (expirationTime < nowSeconds) {
        status = "expired";
      } else if (minted >= cap && cap > 0n) {
        status = "fullyUsed";
      } else {
        status = "active";
      }

      return {
        name: program.name,
        proposalUrl: program.proposalUrl,
        chainId: program.chainId,
        rootAddress,
        cap,
        minted,
        startTime,
        expirationTime,
        status,
      };
    });

    unsorted.sort((a, b) => {
      const byStatus = statusRank[a.status] - statusRank[b.status];
      if (byStatus !== 0) return byStatus;
      // Newest first within each status bucket
      return b.startTime - a.startTime;
    });

    return unsorted;
  }, [data, programRoots]);

  const combinedPending = isMainnet
    ? isMainnetPending || isContractsPending
    : isContractsPending;

  const combinedError = (mainnetError ?? contractsError) ?? null;

  return { rows, isPending: combinedPending, error: combinedError };
}
