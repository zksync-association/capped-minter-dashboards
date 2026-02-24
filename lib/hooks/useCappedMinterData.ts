"use client";

import { useMemo } from "react";
import { useReadContracts } from "wagmi";
import { zkCappedMinterAbi } from "@/lib/abis/zkCappedMinter";
import { getProgramsForChain } from "@/lib/programs";
import { getChainId } from "@/lib/utils";
import type { ProgramConfig } from "@/lib/programs";

export type ProgramRow = ProgramConfig & {
  cap: bigint;
  minted: bigint;
  startTime: number;
  expirationTime: number;
};

/** Batch-read CAP, minted, START_TIME, EXPIRATION_TIME from all root capped minters via multicall. */
export function useCappedMinterData(): {
  rows: ProgramRow[];
  isPending: boolean;
  error: Error | null;
} {
  const chainId = getChainId();
  const programs = useMemo(() => getProgramsForChain(chainId), [chainId]);

  const contracts = useMemo(() => {
    const list: Array<{
      address: `0x${string}`;
      abi: typeof zkCappedMinterAbi;
      functionName: "CAP" | "minted" | "START_TIME" | "EXPIRATION_TIME";
      chainId: number;
    }> = [];
    for (const p of programs) {
      list.push(
        { address: p.rootAddress, abi: zkCappedMinterAbi, functionName: "CAP", chainId },
        { address: p.rootAddress, abi: zkCappedMinterAbi, functionName: "minted", chainId },
        { address: p.rootAddress, abi: zkCappedMinterAbi, functionName: "START_TIME", chainId },
        { address: p.rootAddress, abi: zkCappedMinterAbi, functionName: "EXPIRATION_TIME", chainId }
      );
    }
    return list;
  }, [programs, chainId]);

  const { data, isPending, error } = useReadContracts({
    contracts,
    query: { enabled: contracts.length > 0 },
  });

  const rows = useMemo((): ProgramRow[] => {
    if (!data || data.length !== programs.length * 4) return [];
    return programs.map((p, i) => {
      const base = i * 4;
      const cap = (data[base]?.result ?? 0n) as bigint;
      const minted = (data[base + 1]?.result ?? 0n) as bigint;
      const startTime = Number((data[base + 2]?.result ?? 0n) as bigint);
      const expirationTime = Number((data[base + 3]?.result ?? 0n) as bigint);
      return {
        ...p,
        cap,
        minted,
        startTime,
        expirationTime,
      };
    });
  }, [data, programs]);

  return { rows, isPending, error: error ?? null };
}
