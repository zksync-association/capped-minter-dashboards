"use client";

import { useQuery } from "@tanstack/react-query";
import type { Node, Edge } from "@xyflow/react";
import type { MinterNodeData } from "@/components/program-flow";
import {
  fetchProgramTree,
  type ProgramTreeData,
} from "@/lib/subgraph/client";
import type { MinterType } from "@/lib/types";

/** Subgraph Minter.type values include MinterType + "unknown". */
const MINTER_TYPE_LABELS: Record<MinterType | "unknown", string> = {
  "capped-v3": "Capped Minter V3",
  "capped-v2": "Capped Minter V2",
  delay: "Delay Minter",
  "rate-limit": "Rate Limiter",
  unknown: "Unknown",
};

// Subgraph status is lowercase: "active" | "revoked" | "closed" | "paused"
const STATUS_MAP: Record<string, MinterNodeData["status"]> = {
  active: "Active",
  revoked: "Revoked",
  closed: "Closed",
  paused: "Active",
};

export type ProgramTreeNodesEdges = { nodes: Node[]; edges: Edge[] };

export function programTreeToFlow(
  data: ProgramTreeData | undefined
): ProgramTreeNodesEdges {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  if (!data?.program) return { nodes, edges };

  const { root } = data.program;
  const minters = data.minters ?? [];
  const typeLabel = (type: string) =>
    MINTER_TYPE_LABELS[type as MinterType | "unknown"] ?? "Unknown";
  const status = (s: string): MinterNodeData["status"] =>
    STATUS_MAP[s?.toLowerCase() ?? ""] ?? "Active";

  nodes.push({
    id: root.id,
    type: "minter",
    position: { x: 0, y: 0 },
    data: {
      typeLabel: typeLabel(root.type),
      address: root.id,
      status: status(root.status),
    },
  });

  const rootId = root.id;
  for (const m of minters) {
    if (m.id === rootId) continue;
    nodes.push({
      id: m.id,
      type: "minter",
      position: { x: 0, y: 0 },
      data: {
        typeLabel: typeLabel(m.type),
        address: m.id,
        status: status(m.status),
      },
    });
    if (m.parent?.id) {
      edges.push({
        id: `e-${m.parent.id}-${m.id}`,
        source: m.parent.id,
        target: m.id,
      });
    }
  }

  return { nodes, edges };
}

export function useProgramTree(rootAddress: string | null) {
  const enabled = Boolean(
    process.env.NEXT_PUBLIC_SUBGRAPH_URL && rootAddress
  );
  return useQuery({
    queryKey: ["programTree", rootAddress ?? ""],
    queryFn: () => fetchProgramTree(rootAddress!),
    enabled,
  });
}
