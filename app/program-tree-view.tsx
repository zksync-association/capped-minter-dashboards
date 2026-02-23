"use client";

import { ProgramFlow } from "@/components/program-flow";
import { mockProgramFlowNodes, mockProgramFlowEdges } from "@/mock/program-flow";
// import { useProgramTree, programTreeToFlow } from "@/lib/subgraph";

type ProgramTreeViewProps = {
  selectedProgramId?: string | null;
};

export function ProgramTreeView({ selectedProgramId = null }: ProgramTreeViewProps) {
  // const { data: programTreeData, isLoading } = useProgramTree(selectedProgramId ?? null);
  // const { nodes: realNodes, edges: realEdges } = programTreeToFlow(programTreeData);
  // const useRealData = Boolean(selectedProgramId && programTreeData?.program);
  // const nodes = useRealData ? realNodes : mockProgramFlowNodes;
  // const edges = useRealData ? realEdges : mockProgramFlowEdges;
  // const loading = Boolean(selectedProgramId && isLoading);

  const nodes = mockProgramFlowNodes;
  const edges = mockProgramFlowEdges;
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
