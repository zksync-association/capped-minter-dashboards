import type { ProgramConfig } from "@/lib/programs";

/**
 * Authorized minter programs (testnet only).
 * Mainnet programs are sourced dynamically from the subgraph at runtime.
 * Each program has one or more root minter addresses (rootAddresses) for its flow graph(s).
 */
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

export const TESTNET_PROGRAM_ROOTS: {
  program: ProgramConfig;
  rootAddress: `0x${string}`;
}[] = TESTNET_PROGRAMS.flatMap((program) =>
  program.rootAddresses.map((rootAddress) => ({
    program,
    rootAddress: rootAddress as `0x${string}`,
  }))
);


