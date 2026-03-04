\"use client\";

import { useMemo } from \"react\";
import { useQuery } from \"@tanstack/react-query\";
import type { ProgramConfig } from \"@/lib/programs\";
import {
  fetchProgramsWithProposals,
  type ProgramsWithProposalsData,
  type SubgraphProgram,
} from \"@/lib/subgraph/client\";

const MAINNET_CHAIN_ID = 324;

function getGovernanceProposalBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_GOVERNANCE_PROPOSAL_BASE_URL ??
    \"https://www.tally.xyz/gov/zksync/proposal/\"
  );
}

function mapSubgraphProgramToConfig(program: SubgraphProgram): ProgramConfig {
  const proposal = program.proposal;
  const baseUrl = getGovernanceProposalBaseUrl();
  const proposalUrl =
    proposal != null ? `${baseUrl}${proposal.proposalId}` : \"\";

  const name =
    proposal?.name?.trim()?.length ? proposal.name : `Program ${program.id}`;

  const rootAddress = program.id.toLowerCase() as `0x${string}`;

  return {
    name,
    proposalUrl,
    rootAddresses: [rootAddress],
    chainId: MAINNET_CHAIN_ID,
  };
}

export type MainnetProgramRoot = {
  program: ProgramConfig;
  rootAddress: `0x${string}`;
};

export function useMainnetPrograms(enabled: boolean) {
  const hasSubgraph = Boolean(process.env.NEXT_PUBLIC_SUBGRAPH_URL);

  const query = useQuery({
    queryKey: [\"mainnetProgramsWithProposals\"],
    queryFn: async () => {
      const data: ProgramsWithProposalsData = await fetchProgramsWithProposals();
      return data.programs.map(mapSubgraphProgramToConfig);
    },
    enabled: enabled && hasSubgraph,
  });

  return {
    programs: query.data ?? [],
    isPending: query.isPending,
    error: (query.error as Error | null) ?? null,
  };
}

export function useMainnetProgramRoots(enabled: boolean) {
  const { programs, isPending, error } = useMainnetPrograms(enabled);

  const programRoots = useMemo<MainnetProgramRoot[]>(() => {
    const roots: MainnetProgramRoot[] = [];
    for (const program of programs) {
      for (const rootAddress of program.rootAddresses) {
        roots.push({ program, rootAddress });
      }
    }
    return roots;
  }, [programs]);

  return {
    programRoots,
    isPending,
    error,
  };
}

