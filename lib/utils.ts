import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBlockExplorerAddressUrl(address: string): string {
  const ZKSYNC_MAINNET_EXPLORER = "https://explorer.zksync.io";
  const ZKSYNC_SEPOLIA_EXPLORER = "https://sepolia.explorer.zksync.io";
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
  const base =
    chainId === "300"
      ? ZKSYNC_SEPOLIA_EXPLORER
      : ZKSYNC_MAINNET_EXPLORER;
  return `${base}/address/${address}`;
}