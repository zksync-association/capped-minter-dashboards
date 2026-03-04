"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProgramTreeView } from "./programs/program-tree-view";
import { ProgramsTable } from "./programs/programs-table";

export default function Home() {
  const searchParams = useSearchParams();

  const selectedRootAddress = useMemo(() => {
    const root = searchParams.get("root");
    if (root && root.startsWith("0x")) return root as `0x${string}`;
    return null;
  }, [searchParams]);

  const handleRowSelect = (row: { rootAddress: `0x${string}` }) => {
    const url = `${window.location.pathname}?root=${encodeURIComponent(row.rootAddress)}`;
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="mx-auto w-full max-w-6xl px-6 py-12">
        <section className="mb-8">
          <ProgramTreeView selectedProgramRootAddress={selectedRootAddress} />
        </section>
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Programs
          </h2>
          <ProgramsTable
            onRowSelect={handleRowSelect}
            selectedRootAddress={selectedRootAddress}
          />
        </section>
      </main>
    </div>
  );
}
