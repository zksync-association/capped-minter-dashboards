const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;

export type ProgramTreeMinter = {
  id: string;
  type: string;
  status: string;
  level: number;
  parent?: { id: string } | null;
};

export type ProgramTreeRoot = {
  id: string;
  type: string;
  status: string;
  level: number;
};

export type ProgramTreeData = {
  program: {
    id: string;
    status: string;
    root: ProgramTreeRoot;
  } | null;
  minters: ProgramTreeMinter[];
};

export type ProgramListItem = {
  id: string;
  createdAt: string;
  status?: string;
};

export type ProgramsListData = {
  programs: ProgramListItem[];
};

export type SubgraphProposal = {
  id: string;
  proposalId: string;
  name: string;
  status: string;
};

export type SubgraphProgram = {
  id: string;
  status: string;
  createdAt: string;
  root: ProgramTreeRoot;
  proposal: SubgraphProposal | null;
};

export type ProgramsWithProposalsData = {
  programs: SubgraphProgram[];
};

const PROGRAM_TREE_DOCUMENT = `
  query ProgramTree($rootAddress: Bytes!) {
    program(id: $rootAddress) {
      id
      status
      root {
        id
        type
        status
        level
      }
    }
    minters(where: { root: $rootAddress }) {
      id
      type
      status
      level
      parent {
        id
      }
    }
  }
`;

const PROGRAMS_LIST_DOCUMENT = `
  query ProgramsList {
    programs(first: 100, orderBy: createdAt, orderDirection: desc) {
      id
      createdAt
      status
    }
  }
`;

const PROGRAMS_WITH_PROPOSALS_DOCUMENT = `
  query ProgramsWithProposals {
    programs(
      first: 100
      orderBy: createdAt
      orderDirection: desc
      where: { status: "active" }
    ) {
      id
      status
      createdAt
      root {
        id
        type
        status
        level
      }
      proposal {
        id
        proposalId
        name
        status
      }
    }
  }
`;

const MINTER_BY_ID_DOCUMENT = `
  query MinterById($id: ID!) {
    minter(id: $id) {
      id
    }
  }
`;

export type MinterByIdData = {
  minter: { id: string } | null;
};

async function fetchGraphQL<T>(document: string, variables?: Record<string, unknown>): Promise<T> {
  if (!SUBGRAPH_URL) {
    throw new Error("NEXT_PUBLIC_SUBGRAPH_URL is not set");
  }
  const res = await fetch(SUBGRAPH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: document, variables }),
  });
  if (!res.ok) {
    throw new Error(`Subgraph error: ${res.status}`);
  }
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  if (json.data == null) {
    throw new Error("No data returned from subgraph");
  }
  return json.data;
}

export async function fetchProgramTree(rootAddress: string): Promise<ProgramTreeData> {
  return fetchGraphQL<ProgramTreeData>(PROGRAM_TREE_DOCUMENT, {
    rootAddress: rootAddress.toLowerCase(),
  });
}

export async function fetchProgramsList(): Promise<ProgramsListData> {
  return fetchGraphQL<ProgramsListData>(PROGRAMS_LIST_DOCUMENT);
}

export async function fetchProgramsWithProposals(): Promise<ProgramsWithProposalsData> {
  return fetchGraphQL<ProgramsWithProposalsData>(PROGRAMS_WITH_PROPOSALS_DOCUMENT);
}

/** Returns the minter if indexed, null otherwise. Used for post-deploy polling. */
export async function fetchMinterById(
  id: string
): Promise<MinterByIdData["minter"]> {
  const data = await fetchGraphQL<MinterByIdData>(MINTER_BY_ID_DOCUMENT, {
    id: id.toLowerCase(),
  });
  return data.minter;
}

export type PollUntilIndexedOptions = {
  /** Poll interval in ms. Default 2000. */
  intervalMs?: number;
  /** Max poll attempts before giving up. Default 30 (~60s at 2s interval). */
  maxAttempts?: number;
};

/**
 * Polls the subgraph until the minter is indexed or max attempts reached.
 * Returns true if the minter was found, false if not set or gave up. Does not throw.
 */
export async function pollUntilMinterIndexed(
  address: string,
  options?: PollUntilIndexedOptions
): Promise<boolean> {
  if (!SUBGRAPH_URL) return false;
  const { intervalMs = 2000, maxAttempts = 30 } = options ?? {};
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const minter = await fetchMinterById(address);
      if (minter?.id) return true;
    } catch {
      // Subgraph error or network; keep polling
    }
    if (attempt < maxAttempts - 1) {
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }
  return false;
}
