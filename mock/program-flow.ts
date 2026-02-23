import type { Node, Edge } from "@xyflow/react";

export const mockProgramFlowNodes: Node[] = [
  {
    id: "0xRoot1111111111111111111111111111111111",
    type: "minter",
    position: { x: 0, y: 0 },
    data: {
      typeLabel: "Capped Minter V3",
      address: "0xRoot1111111111111111111111111111111111",
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
];

// Linear chain: root → delay → rate limiter → capped v2 (one mod connected to the next)
export const mockProgramFlowEdges: Edge[] = [
  {
    id: "e-root-child1",
    source: "0xRoot1111111111111111111111111111111111",
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
];
