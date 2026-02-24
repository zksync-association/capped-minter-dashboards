"use client";

import { useMemo } from "react";
import { ProgramFlow } from "@/components/program-flow";
import { getProgramFlow } from "@/lib/programs";
import { MOCK_PROGRAM_FLOWS } from "@/mock/program-flow";
// import { useProgramTree, programTreeToFlow } from "@/lib/hooks/useProgramTree";

type ProgramTreeViewProps = {
  /** When set, shows the graph for this program's root. Otherwise first program's graph. */
  selectedProgramRootAddress?: `0x${string}` | null;
};

export function ProgramTreeView({
  selectedProgramRootAddress = null,
}: ProgramTreeViewProps) {
  const { nodes, edges } = useMemo(() => {
    const flow = selectedProgramRootAddress
      ? getProgramFlow(selectedProgramRootAddress)
      : MOCK_PROGRAM_FLOWS[0];
    if (!flow) {
      return { nodes: [], edges: [] };
    }
    return { nodes: flow.nodes, edges: flow.edges };
  }, [selectedProgramRootAddress]);

  // const { data: programTreeData, isLoading } = useProgramTree(selectedProgramRootAddress ?? null);
  // const useRealData = Boolean(selectedProgramRootAddress && programTreeData?.program);
  const loading = false;

  return (
    <ProgramFlow
      nodes={nodes}
      edges={edges}
      loading={loading}
      className="w-full rounded-lg border border-border"
    />
  );
}
