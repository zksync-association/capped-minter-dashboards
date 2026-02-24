import { getChainId } from "@/lib/utils";
import type { MinterType } from "@/lib/types";

const FACTORY_ADDRESSES: Record<
  MinterType,
  Partial<Record<number, `0x${string}`>>
> = {
  "capped-v3": {
    324: "0x0000000000000000000000000000000000000000" as `0x${string}`, // zkSync Era mainnet — replace with deployed address
    300: "0x0000000000000000000000000000000000000000" as `0x${string}`, // zkSync Sepolia testnet
  },
  "capped-v2": {
    324: "0x0000000000000000000000000000000000000000" as `0x${string}`, // TBD — placeholder
    300: "0x0000000000000000000000000000000000000000" as `0x${string}`, // TBD — placeholder
  },
  delay: {
    324: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    300: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
  "rate-limit": {
    324: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    300: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
};

/**
 * Returns the factory contract address for the given minter type on the current chain.
 * Returns undefined if the chain is not configured for this minter type.
 */
export function getFactoryAddress(
  type: MinterType,
  chainId: number = getChainId()
): `0x${string}` | undefined {
  const address = FACTORY_ADDRESSES[type][chainId];
  return address;
}

export { FACTORY_ADDRESSES };
