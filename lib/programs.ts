import { PROGRAMS } from "@/data/programs";
import { getMockFlowForRoot, type ProgramFlowData } from "@/mock/program-flow";

export type ProgramConfig = {
  name: string;
  proposalUrl: string;
  rootAddress: `0x${string}`;
  chainId: number;
};

export function getProgramsForChain(chainId: number): ProgramConfig[] {
  return PROGRAMS.filter((p) => p.chainId === chainId);
}

/** Returns the flow graph for a program by root address (mock for now; replace with subgraph later). */
export function getProgramFlow(rootAddress: `0x${string}`): ProgramFlowData | undefined {
  return getMockFlowForRoot(rootAddress);
}
