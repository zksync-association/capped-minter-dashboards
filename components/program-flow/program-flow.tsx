"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
  type Node,
  type Edge,
  type NodeTypes,
  ReactFlowProvider,
} from "@xyflow/react";
import type { MouseEvent as ReactMouseEvent } from "react";
import dagre from "dagre";
import { ProgramFlowNode } from "./program-flow-node";
import { getBlockExplorerAddressUrl } from "@/lib/utils";

import "@xyflow/react/dist/style.css";

const NODE_WIDTH = 160;
const NODE_HEIGHT = 56;

type ProgramFlowProps = {
  nodes: Node[];
  edges: Edge[];
  loading?: boolean;
  className?: string;
};

function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "TB"
) {
  const g = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep: 40, ranksep: 60 });

  nodes.forEach((node) => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const isHorizontal = direction === "LR";
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
    };
  });

  return { nodes: layoutedNodes, edges };
}

const nodeTypes: NodeTypes = { minter: ProgramFlowNode };

function ProgramFlowInner({
  nodes: initialNodes,
  edges: initialEdges,
  loading,
  className,
}: ProgramFlowProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(initialNodes, initialEdges, "TB"),
    [initialNodes, initialEdges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  useEffect(() => {
    const { nodes: nextNodes, edges: nextEdges } = getLayoutedElements(
      initialNodes,
      initialEdges,
      "TB"
    );
    setNodes(nextNodes);
    setEdges(nextEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_: ReactMouseEvent, node: Node) => {
      const address = (node.data as { address?: string }).address;
      if (address) {
        window.open(
          getBlockExplorerAddressUrl(address),
          "_blank",
          "noopener,noreferrer"
        );
      }
    },
    []
  );

  const defaultEdgeOptions = useMemo(
    () => ({
      type: "smoothstep" as const,
      markerEnd: { type: MarkerType.ArrowClosed },
    }),
    []
  );

  if (loading) {
    return (
      <div className={className} style={{ height: 400 }}>
        <div className="flex h-full w-full items-center justify-center rounded-lg border border-border bg-muted/30">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ height: 400 }}>
      <ReactFlow
        colorMode={mounted && resolvedTheme === "dark" ? "dark" : "light"}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={defaultEdgeOptions}
      >
        <Controls />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export function ProgramFlow(props: ProgramFlowProps) {
  return (
    <ReactFlowProvider>
      <ProgramFlowInner {...props} />
    </ReactFlowProvider>
  );
}

export type { MinterNode, MinterNodeData } from "./program-flow-node";
