"use client";

import { useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ProgramTreeView } from "./programs/program-tree-view";
import { ProgramsTable } from "./programs/programs-table";
import { getChainId } from "@/lib/utils";

export default function Home() {
  const isTestnet = getChainId() === 300;

  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedRootAddress = useMemo(() => {
    const root = searchParams.get("root");
    if (root && root.startsWith("0x")) return root as `0x${string}`;
    return null;
  }, [searchParams]);

  const handleRowSelect = useCallback(
    (row: { rootAddress: `0x${string}` }) => {
      // Use Next.js client-side navigation to avoid full page reloads.
      router.replace(
        `/?root=${encodeURIComponent(row.rootAddress)}`,
        { scroll: false }
      );
    },
    [router]
  );

  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="mx-auto w-full max-w-6xl px-6 py-12">
        <section className="mb-8 rounded-lg border border-border bg-brand-100/40 dark:bg-white/[0.05] px-6 py-5 flex items-center gap-4">
          <Image
            src="/brand/icons/governance.svg"
            alt=""
            width={48}
            height={48}
            className="shrink-0"
          />
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {isTestnet
                ? "ZKsync Testnet Capped Minter Overview"
                : "ZKsync Token Program Capped Minter Overview"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isTestnet
                ? "View and explore ZKsync capped minters deployed on testnet and approved through the testnet governance interface. Please note the testnet governance interface is not open to the public."
                : "View and explore ZKsync Token Programs approved through the ZKsync governance system."}
            </p>
          </div>
        </section>
        <section className="mb-8">
          <ProgramTreeView selectedProgramRootAddress={selectedRootAddress} />
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            {isTestnet
              ? "ZKsync Testnet Capped Minters"
              : "ZKsync Token Programs"}
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            {isTestnet ? (
              <>
                The following table displays all testnet parent capped minters approved via
                testnet governance interface.
                <br />The image above will display all testnet child capped minters (if any) for
                each mechanic.
              </>
            ) : (
              <>
                The following table displays all parent capped minters from all
                Token Programs approved through the ZKsync governance system.
                <br />The image above will display all child capped minters (if any) for each
                program.
              </>
            )}
          </p>
          <ProgramsTable
            onRowSelect={handleRowSelect}
            selectedRootAddress={selectedRootAddress}
          />
        </section>
      </main>
    </div>
  );
}
