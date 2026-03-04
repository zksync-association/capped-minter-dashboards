"use client";

import { useMemo } from "react";
import { ProgramFlow } from "@/components/program-flow";
import { getChainId } from "@/lib/utils";
import { useProgramTree, programTreeToFlow } from "@/lib/hooks/useProgramTree";
import { useMainnetProgramRoots } from "@/lib/hooks/useMainnetPrograms";
import { TESTNET_PROGRAM_ROOTS } from "@/data/programs.testnet";

type ProgramTreeViewProps = {
  /** When set, shows the graph for this program's root. Otherwise first program's graph. */
  selectedProgramRootAddress?: `0x${string}` | null;
};

export function ProgramTreeView({
  selectedProgramRootAddress = null,
}: ProgramTreeViewProps) {
  const chainId = getChainId();
  const isMainnet = chainId === 324;

  const {
    programRoots: mainnetProgramRoots,
  } = useMainnetProgramRoots(isMainnet);

  const programRoots = isMainnet ? mainnetProgramRoots : TESTNET_PROGRAM_ROOTS;

  const rootToShow =
    selectedProgramRootAddress ??
    programRoots[0]?.rootAddress ??
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
