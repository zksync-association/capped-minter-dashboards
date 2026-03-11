"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Clock,
  Gauge,
  Layers,
  Box,
  KeyRound,
  type LucideIcon,
  CircleQuestionMarkIcon,
} from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MinterType } from "@/lib/types";
import { DEPLOY_PROGRESS_EVENT_NAME } from "@/lib/hooks/useDeployMinter";
import { useDeployProgressStore } from "@/lib/stores/deployProgressStore";

const DEPLOY_ITEMS: {
  href: string;
  label: string;
  icon: LucideIcon;
}[] = [
  { href: "/deploy/capped-v3", label: "Capped Minter V3", icon: Layers },
  // { href: "/deploy/capped-v2", label: "Capped Minter V2", icon: Box },
  { href: "/deploy/delay", label: "Delay Minter Mod", icon: Clock },
  { href: "/deploy/rate-limit", label: "Rate Limit Mod", icon: Gauge },
];

const MAX_DEPLOY_AGE_MS = 60 * 60 * 1000; // 1 hour

export function Header() {
  const activeDeploy = useDeployProgressStore((s) => s.activeDeploy);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  const pendingDeploy =
    activeDeploy &&
    activeDeploy.type &&
    now - activeDeploy.startedAt < MAX_DEPLOY_AGE_MS
      ? activeDeploy
      : null;

  const resolveDeployHref = (type: MinterType) => `/deploy/${type}?showProgress=true`;

  return (
    <header className="w-full">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
          >
            ZKsync Token Program Capped Minter Overview
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-muted-foreground hover:text-foreground"
              >
                Deploy
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {DEPLOY_ITEMS.map(({ href, label, icon: Icon }) => (
                <DropdownMenuItem key={href} asChild>
                  <Link href={href} className="flex items-center gap-2">
                    <Icon className="size-4 shrink-0" />
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href="/grant-role"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <KeyRound className="size-4" />
            Grant role
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {pendingDeploy && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              asChild
            >
              <Link
                href={resolveDeployHref(pendingDeploy.type)}
                onClick={() => {
                  if (typeof window === "undefined") return;
                  const targetPath = `/deploy/${pendingDeploy.type}`;
                  if (window.location.pathname.startsWith(targetPath)) {
                    window.dispatchEvent(
                      new Event(DEPLOY_PROGRESS_EVENT_NAME)
                    );
                  }
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <span className="hidden sm:inline">Transaction in progress</span>
                <span className="sm:hidden">Tx in progress</span>
              </Link>
            </Button>
          )}
          <ConnectButton showBalance={false} />
          <ThemeToggle />
          <Link
            href="/how-to"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            <CircleQuestionMarkIcon className="size-4" />
          </Link>
        </div>
      </div>
      <Separator />
    </header>
  );
}
