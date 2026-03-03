import type { ProgramConfig } from "@/lib/programs";

/**
 * Authorized minter programs. Updated via PRs when new programs are approved by governance.
 * Each program has one or more root minter addresses (rootAddresses) for its flow graph(s).
 */
 const MAINNET_PROGRAMS: ProgramConfig[] = [
  {
    name: "ZKnomics Token Staking",
    proposalUrl: "https://www.tally.xyz/gov/zksync/proposal/97314764080859415498674952864578860560861880297360481348949362100730414449748",
    rootAddresses: ["0xb1c5f8ea8cE447FDaFB234D85EAD8c8A83b6306B"],
    chainId: 324,
  },
  {
    name: "Unknown Proposal 1",
    proposalUrl: "https://www.tally.xyz/gov/zksync/proposal/todo",
    rootAddresses: ["0x51e818785dea065d392ac21f04e9cac5b601cfd8"],
    chainId: 324,
  },
  {
    name: "Unknown Proposal 2",
    proposalUrl: "https://www.tally.xyz/gov/zksync/proposal/todo",
    rootAddresses: ["0x1e386bc1fc6556c831371816f0a62705189939a1"],
    chainId: 324,
  },
  {
    name: "Unknown Proposal 3",
    proposalUrl: "https://www.tally.xyz/gov/zksync/proposal/todo",
    rootAddresses: ["0xcfa355a6678a38c401b89bf44c6f98af5a98572b"],
    chainId: 324,
  }
];

export const TESTNET_PROGRAMS: ProgramConfig[] = [
  {
    name: "1 Mod",
    proposalUrl: "https://sepolia.explorer.zksync.io",
    rootAddresses: ["0x12E328c3fece3Acc10B4FE85dA8d9Bd8C56BB528"],
    chainId: 300,
  },
  {
    name: "2 Mod",
    proposalUrl: "https://sepolia.explorer.zksync.io",
    rootAddresses: ["0x56033c5ae0175a02c0d83126dadda4fbc5802402"],
    chainId: 300,
  },
  {
    name: "3 Mod",
    proposalUrl: "https://sepolia.explorer.zksync.io",
    rootAddresses: ["0xb8018036649b88bb3ee74a46d87a940d7b39076a"],
    chainId: 300,
  },
];

export const PROGRAMS: ProgramConfig[] = [
  ...MAINNET_PROGRAMS,
  ...TESTNET_PROGRAMS,
];