"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { useTheme } from "next-themes";
import { WagmiProvider } from "wagmi";
import { getWagmiConfig } from "@/lib/wagmi";
import { ThemeProvider } from "./theme-provider";

const queryClient = new QueryClient();

const RAINBOW_LIGHT_THEME = lightTheme({
  accentColor: "#0C18EC",
  accentColorForeground: "white",
  borderRadius: "medium",
});

const RAINBOW_DARK_THEME = darkTheme({
  accentColor: "#8897F2",
  accentColorForeground: "#0a0a0a",
  borderRadius: "medium",
});

function RainbowKitWithTheme({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const theme =
    resolvedTheme === "dark" ? RAINBOW_DARK_THEME : RAINBOW_LIGHT_THEME;

  return <RainbowKitProvider theme={theme}>{children}</RainbowKitProvider>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ReturnType<typeof getWagmiConfig>>(null);

  useEffect(() => {
    queueMicrotask(() => setConfig(getWagmiConfig()));
  }, []);

  if (!config) {
    return (
      <ThemeProvider>
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitWithTheme>{children}</RainbowKitWithTheme>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
