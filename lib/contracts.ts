import { getChainId } from "@/lib/utils";
import type { MinterType } from "@/lib/types";

const FACTORY_ADDRESSES: Record<
  MinterType,
  Partial<Record<number, `0x${string}`>>
> = {
  "capped-v3": {
    324: "0xABF70d9a1fe52ca5e9339A6Ef76759614C1b5eE9" as `0x${string}`, // zkSync Era mainnet
    300: "0xABF70d9a1fe52ca5e9339A6Ef76759614C1b5eE9" as `0x${string}`, // zkSync Sepolia testnet
  },
  "capped-v2": {
    324: "0x0400E6bc22B68686Fb197E91f66E199C6b0DDD6a" as `0x${string}`, // zkSync Era mainnet
    300: "0x329CE320a0Ef03F8c0E01195604b5ef7D3Fb150E" as `0x${string}`, // zkSync Sepolia testnet
  },
  delay: {
    324: "0x022cd302a2A0C7f78EC17341cAB911eCE3E7CCC5" as `0x${string}`, // zkSync Era mainnet
    300: "0x8f89e7f68C155932968E273459Df90591Fc4BD67" as `0x${string}`, // zkSync Sepolia testnet
  },
  "rate-limit": {
    324: "0x6Cb59905FCEDA9f578a5fAC5867D0560f762Cb00" as `0x${string}`, // zkSync Era mainnet
    300: "0x6Cb59905FCEDA9f578a5fAC5867D0560f762Cb00" as `0x${string}`, // zkSync Sepolia testnet
  },
};

const ZK_TOKEN_ADDRESSES: Partial<Record<number, `0x${string}`>> = {
  324: "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E" as `0x${string}`, // zkSync Era mainnet ZK token
  300: "0x279bf39BfEf85aab8Ece893F833aF6C045E4d7d2" as `0x${string}`, // zkSync Sepolia testnet ZK token
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

export function getZkTokenAddress(
  chainId: number = getChainId()
): `0x${string}` | undefined {
  return ZK_TOKEN_ADDRESSES[chainId];
}

export { FACTORY_ADDRESSES, ZK_TOKEN_ADDRESSES };
