import type { ProgramConfig } from "@/lib/programs";

/**
 * Authorized minter programs. Updated via PRs when new programs are approved by governance.
 * Each program is linked to its flow graph by rootAddress.
 */
export const PROGRAMS: ProgramConfig[] = [
  {
    name: "Assign Minter Role to Gov Infra Capped Minter",
    proposalUrl: "https://www.tally.xyz/gov/zksync/proposal/59956436467786828609747327435664724459335730934530897411573906572229159062327",
    rootAddress: "0x8d03F20C213D435A8B50127DE3d5797845b2120D" as `0x${string}`,
    chainId: 324,
  },
  {
    name: "ZKnomics Token Staking",
    proposalUrl: "https://www.tally.xyz/gov/zksync/proposal/97314764080859415498674952864578860560861880297360481348949362100730414449748",
    rootAddress: "0xb1c5f8ea8cE447FDaFB234D85EAD8c8A83b6306B" as `0x${string}`,
    chainId: 324,
  },
];
