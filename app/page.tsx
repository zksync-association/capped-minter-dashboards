"use client";

import { useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProgramTreeView } from "./programs/program-tree-view";
import { ProgramsTable } from "./programs/programs-table";

export default function Home() {
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
        <section className="mb-8">
          <ProgramTreeView selectedProgramRootAddress={selectedRootAddress} />
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            ZKsync Token Programs
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            The following table displays all parent capped minters from all
            Token Programs approved through the ZKsync governance system. The
            image above will display all child capped minters (if any) for each
            program.
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
