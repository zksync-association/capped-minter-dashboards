export type ProgramConfig = {
  name: string;
  proposalUrl: string;
  /** One or more root minter addresses (e.g. when a proposal authorizes multiple roots). */
  rootAddresses: `0x${string}`[];
  chainId: number;
};
