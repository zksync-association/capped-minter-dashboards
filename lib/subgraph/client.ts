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
    minters: ProgramTreeMinter[];
  } | null;
};

export type ProgramListItem = {
  id: string;
  createdAt: string;
  status?: string;
};

export type ProgramsListData = {
  programs: ProgramListItem[];
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
      minters {
        id
        type
        status
        level
        parent {
          id
        }
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
