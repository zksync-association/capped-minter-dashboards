"use client";

import Link from "next/link";
import {
  ChevronDown,
  Clock,
  Gauge,
  Layers,
  Box,
  type LucideIcon,
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

const DEPLOY_ITEMS: {
  href: string;
  label: string;
  icon: LucideIcon;
}[] = [
  { href: "/deploy/capped-v3", label: "Capped Minter V3", icon: Layers },
  { href: "/deploy/capped-v2", label: "Capped Minter V2", icon: Box },
  { href: "/deploy/delay", label: "Delay Minter Mod", icon: Clock },
  { href: "/deploy/rate-limit", label: "Rate Limit Mod", icon: Gauge },
];

export function Header() {
  return (
    <header className="w-full">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
          >
            Capped Minter
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
        </nav>
        <div className="flex items-center gap-2">
          <ConnectButton />
          <ThemeToggle />
        </div>
      </div>
      <Separator />
    </header>
  );
}
