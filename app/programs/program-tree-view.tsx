"use client";

import { useMemo } from "react";
import { ProgramFlow } from "@/components/program-flow";
import { getProgramsForChain } from "@/lib/programs";
import { getChainId } from "@/lib/utils";
import { useProgramTree, programTreeToFlow } from "@/lib/hooks/useProgramTree";

type ProgramTreeViewProps = {
  /** When set, shows the graph for this program's root. Otherwise first program's graph. */
  selectedProgramRootAddress?: `0x${string}` | null;
};

export function ProgramTreeView({
  selectedProgramRootAddress = null,
}: ProgramTreeViewProps) {
  const chainId = getChainId();
  const programs = useMemo(
    () => getProgramsForChain(chainId),
    [chainId]
  );
  const rootToShow =
    selectedProgramRootAddress ??
    programs[0]?.rootAddresses?.[0] ??
    null;

  const { data: programTreeData, isPending } = useProgramTree(
    rootToShow ?? null
  );

  const { nodes, edges } = useMemo(() => {
    if (!programTreeData?.program) return { nodes: [], edges: [] };
    return programTreeToFlow(programTreeData);
  }, [programTreeData]);

  return (
    <ProgramFlow
      nodes={nodes}
      edges={edges}
      loading={isPending}
      className="w-full rounded-lg border border-border"
    />
  );
}
