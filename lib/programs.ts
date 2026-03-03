import { PROGRAMS } from "@/data/programs";

export type ProgramConfig = {
  name: string;
  proposalUrl: string;
  /** One or more root minter addresses (e.g. when a proposal authorizes multiple roots). */
  rootAddresses: `0x${string}`[];
  chainId: number;
};

export function getProgramsForChain(chainId: number): ProgramConfig[] {
  return PROGRAMS.filter((p) => p.chainId === chainId);
}

/** Flatten to one entry per root for table/selection. */
export function getProgramRootsForChain(chainId: number): { program: ProgramConfig; rootAddress: `0x${string}` }[] {
  const programs = getProgramsForChain(chainId);
  const result: { program: ProgramConfig; rootAddress: `0x${string}` }[] = [];
  for (const program of programs) {
    for (const rootAddress of program.rootAddresses) {
      result.push({ program, rootAddress });
    }
  }
  return result;
}
