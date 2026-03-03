/**
 * Minimal ABI for OpenZeppelin-style AccessControl: grantRole(role, account).
 * Use on the token (mintable) contract to grant MINTER_ROLE to a minter mod.
 */
export const accessControlAbi = [
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

/** OpenZeppelin MINTER_ROLE = keccak256("MINTER_ROLE") */
export const MINTER_ROLE =
  "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6" as `0x${string}`;
