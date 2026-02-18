import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { zksync, zksyncSepoliaTestnet } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Capped Minter",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
  chains: [zksync, zksyncSepoliaTestnet],
  ssr: true,
});
