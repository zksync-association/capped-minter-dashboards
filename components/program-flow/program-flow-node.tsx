"use client";

import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";

export type MinterNodeData = {
  typeLabel: string;
  address: string;
  status: "Active" | "Revoked" | "Closed";
};

export type MinterNode = Node<MinterNodeData, "minter">;

const statusBorderClass: Record<MinterNodeData["status"], string> = {
  Active: "border-green-500",
  Revoked: "border-red-500",
  Closed: "border-gray-500",
};

function truncateAddress(address: string): string {
  if (address.length <= 14) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function ProgramFlowNode(props: NodeProps<MinterNode>) {
  const { data } = props;
  const status = data.status ?? "Active";
  const borderClass = statusBorderClass[status];

  return (
    <>
      <Handle type="target" position={Position.Top} className="!w-2 !h-2" />
      <div
        className={cn(
          "rounded-lg border-2 bg-card text-card-foreground px-3 py-2 shadow-sm min-w-[140px]",
          borderClass
        )}
      >
        <div className="text-xs font-medium text-muted-foreground">
          {data.typeLabel ?? "Unknown"}
        </div>
        <div className="font-mono text-sm">{truncateAddress(data.address)}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2" />
    </>
  );
}
