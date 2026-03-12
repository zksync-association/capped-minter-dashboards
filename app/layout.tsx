import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import { Header } from "./header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZKsync Token Program Capped Minter Overview",
  description: "Capped Minter Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Providers>
          <Header />
          {children}
          <footer className="border-t border-border dark:border-white/10 mt-auto">
            <div className="mx-auto w-full max-w-6xl px-6 py-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Image
                src="/brand/icons/governance.svg"
                alt=""
                width={20}
                height={20}
                className="shrink-0"
              />
              <Link
                href="https://docs.zknation.io/zksync-governance-proposals/token-program-proposals-tpps/capped-minters-101"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-500 dark:hover:text-brand-300 transition-colors"
              >
                ZK Nation Governance
              </Link>
            </div>
          </footer>
          <Toaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
