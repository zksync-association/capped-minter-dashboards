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
  {
    name: "4 Mod",
    proposalUrl: "https://sepolia.explorer.zksync.io",
    rootAddresses: ["0xCab3350EC4aF384901395561E9aFD8E6D052c6bb"],
    chainId: 300,
  },
  {
    name: "5 Mod",
    proposalUrl: "https://sepolia.explorer.zksync.io",
    rootAddresses: ["0x55E2EFAe8641153d2979332b29380FDE34Ce0a44"],
    chainId: 300,
  },
  {
    name: "6 Mod",
    proposalUrl: "https://sepolia.explorer.zksync.io",
    rootAddresses: ["0x7350Be6Ed47cA21075f098422e47375cC49fd1Ba"],
    chainId: 300,
  },
  {
    name: "7 Mod",
    proposalUrl: "https://sepolia.explorer.zksync.io",
    rootAddresses: ["0xa966432eF4c6C027f7Acbd710e070Cdb652D45Be"],
    chainId: 300,
  },
  {
    name: "8 Mod",
    proposalUrl: "https://sepolia.explorer.zksync.io",
    rootAddresses: ["0x620Bf4BbEb0C31D221Ab674587A6d02E85636B8C"],
    chainId: 300,
  },
  {
    name: "9 Mod",
    proposalUrl: "https://sepolia.explorer.zksync.io",
    rootAddresses: ["0xD02dc616e42230597443DE81E03513879c2b1654"],
    chainId: 300,
  },
  {
    name: "10 Mod",
    proposalUrl: "https://sepolia.explorer.zksync.io",
    rootAddresses: ["0x1181F23559aF97851e2834c888373Cd2baF5dD6e"],
    chainId: 300,
  }
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


