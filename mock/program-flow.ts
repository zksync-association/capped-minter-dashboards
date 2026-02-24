import type { Node, Edge } from "@xyflow/react";

export type ProgramFlowData = {
  rootAddress: `0x${string}`;
  nodes: Node[];
  edges: Edge[];
};

/** One flow per program, keyed by rootAddress. Order matches data/programs for convenience. */
export const MOCK_PROGRAM_FLOWS: ProgramFlowData[] = [
  {
    rootAddress: "0x8d03F20C213D435A8B50127DE3d5797845b2120D" as `0x${string}`,
    nodes: [
      {
        id: "0x8d03F20C213D435A8B50127DE3d5797845b2120D",
        type: "minter",
        position: { x: 0, y: 0 },
        data: {
          typeLabel: "Capped Minter V3",
          address: "0x8d03F20C213D435A8B50127DE3d5797845b2120D",
          status: "Active",
        },
      },
      {
        id: "0xChild1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        type: "minter",
        position: { x: 0, y: 0 },
        data: {
          typeLabel: "Delay Minter",
          address: "0xChild1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          status: "Active",
        },
      },
      {
        id: "0xChild2bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        type: "minter",
        position: { x: 0, y: 0 },
        data: {
          typeLabel: "Rate Limiter",
          address: "0xChild2bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
          status: "Active",
        },
      },
      {
        id: "0xGrandcccccccccccccccccccccccccccccccc",
        type: "minter",
        position: { x: 0, y: 0 },
        data: {
          typeLabel: "Capped Minter V2",
          address: "0xGrandcccccccccccccccccccccccccccccccc",
          status: "Revoked",
        },
      },
    ],
    edges: [
      {
        id: "e-root-child1",
        source: "0x8d03F20C213D435A8B50127DE3d5797845b2120D",
        target: "0xChild1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      },
      {
        id: "e-child1-child2",
        source: "0xChild1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        target: "0xChild2bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      },
      {
        id: "e-child2-grand",
        source: "0xChild2bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        target: "0xGrandcccccccccccccccccccccccccccccccc",
      },
    ],
  },
  {
    rootAddress: "0xb1c5f8ea8cE447FDaFB234D85EAD8c8A83b6306B" as `0x${string}`,
    nodes: [
      {
        id: "0xb1c5f8ea8cE447FDaFB234D85EAD8c8A83b6306B",
        type: "minter",
        position: { x: 0, y: 0 },
        data: {
          typeLabel: "Capped Minter V3",
          address: "0xb1c5f8ea8cE447FDaFB234D85EAD8c8A83b6306B",
          status: "Active",
        },
      },
      {
        id: "0xChild2a11111111111111111111111111111111",
        type: "minter",
        position: { x: 0, y: 0 },
        data: {
          typeLabel: "Delay Minter",
          address: "0xChild2a11111111111111111111111111111111",
          status: "Active",
        },
      },
    ],
    edges: [
      {
        id: "e-r2-root-child",
        source: "0xb1c5f8ea8cE447FDaFB234D85EAD8c8A83b6306B",
        target: "0xChild2a11111111111111111111111111111111",
      },
    ],
  },
];

/** Look up mock flow for a program by root address. */
export function getMockFlowForRoot(
  rootAddress: `0x${string}`
): ProgramFlowData | undefined {
  return MOCK_PROGRAM_FLOWS.find(
    (f) => f.rootAddress.toLowerCase() === rootAddress.toLowerCase()
  );
}
