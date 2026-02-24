import type { Config } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { zksync, zksyncSepoliaTestnet } from "wagmi/chains";
import { getChainId } from "@/lib/utils";

const chain = getChainId() === 300 ? zksyncSepoliaTestnet : zksync;

/** Call only in the browser; avoids indexedDB on server. */
export function getWagmiConfig(): Config | null {
  if (typeof window === "undefined") return null;
  return getDefaultConfig({
    appName: "Capped Minter",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
    chains: [chain],
    ssr: true,
  });
}
