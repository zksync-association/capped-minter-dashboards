"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProgramTreeView } from "./programs/program-tree-view";
import { ProgramsTable } from "./programs/programs-table";
import { getProgramsForChain } from "@/lib/programs";
import { getChainId } from "@/lib/utils";

export default function Home() {
  const searchParams = useSearchParams();
  const chainId = getChainId();
  const programs = useMemo(() => getProgramsForChain(chainId), [chainId]);

  const selectedRootAddress = useMemo(() => {
    const root = searchParams.get("root");
    if (root && root.startsWith("0x")) return root as `0x${string}`;
    return programs[0]?.rootAddress ?? null;
  }, [searchParams, programs]);

  const handleRowSelect = (program: (typeof programs)[number]) => {
    const url = `${window.location.pathname}?root=${encodeURIComponent(program.rootAddress)}`;
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
