"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  getBlockExplorerAddressUrl,
  cn,
  formatTokenAmount,
  formatDate,
  truncateAddress,
} from "@/lib/utils";
import { useCappedMinterData, type ProgramRow } from "@/lib/hooks/useCappedMinterData";
import type { ProgramConfig } from "@/lib/programs";

type ProgramsTableProps = {
  /** When a row is clicked, this program becomes the selected one (e.g. for graph). */
  onRowSelect?: (program: ProgramConfig) => void;
  /** Root address of the currently selected program; row is highlighted when it matches. */
  selectedRootAddress?: `0x${string}` | null;
};

export function ProgramsTable({
  onRowSelect,
  selectedRootAddress = null,
}: ProgramsTableProps = {}) {
  const { rows, isPending, error } = useCappedMinterData();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "startTime", desc: true },
  ]);

  const columns = useMemo<ColumnDef<ProgramRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <a
            href={row.original.proposalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline decoration-primary/50 hover:text-primary hover:decoration-primary"
          >
            {row.original.name}
          </a>
        ),
      },
      {
        accessorKey: "rootAddress",
        header: "Address",
        cell: ({ row }) => {
          const url = getBlockExplorerAddressUrl(row.original.rootAddress);
          return (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline decoration-primary/50 hover:text-primary hover:decoration-primary"
            >
              {truncateAddress(row.original.rootAddress)}
            </a>
          );
        },
      },
      {
        accessorKey: "cap",
        header: "Approved",
        cell: ({ row }) => formatTokenAmount(row.original.cap),
      },
      {
        accessorKey: "minted",
        header: "Used",
        cell: ({ row }) => formatTokenAmount(row.original.minted),
      },
      {
        accessorKey: "startTime",
        header: "Start",
        cell: ({ row }) => formatDate(row.original.startTime),
      },
      {
        accessorKey: "expirationTime",
        header: "End",
        cell: ({ row }) => formatDate(row.original.expirationTime),
      },
    ],
    []
  );

  // TanStack Table's useReactTable returns functions that React Compiler cannot memoize
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    sortDescFirst: true,
  });

  if (isPending && rows.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-border bg-card py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-destructive py-8 text-center">
        Failed to load program data: {error.message}
      </p>
    );
  }

  if (rows.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        No programs for this network.
      </p>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-border bg-muted/40">
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const isSorted = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    className={cn(
                      "px-4 py-3.5 font-semibold text-foreground",
                      canSort && "cursor-pointer select-none hover:bg-muted/60"
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <span className="inline-flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {canSort &&
                        (isSorted === "desc" ? (
                          <ArrowDown className="size-4" />
                        ) : isSorted === "asc" ? (
                          <ArrowUp className="size-4" />
                        ) : null)}
                    </span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, rowIndex) => {
            const isExpired = row.original.expirationTime < Date.now() / 1000;
            const isFullyUsed =
              row.original.minted >= row.original.cap;
            const muted = isExpired || isFullyUsed;
            const isSelected =
              selectedRootAddress != null &&
              row.original.rootAddress.toLowerCase() === selectedRootAddress.toLowerCase();
            const zebra = rowIndex % 2 === 1;
            return (
              <tr
                key={row.id}
                role={onRowSelect ? "button" : undefined}
                tabIndex={onRowSelect ? 0 : undefined}
                onClick={onRowSelect ? () => onRowSelect(row.original) : undefined}
                onKeyDown={
                  onRowSelect
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onRowSelect(row.original);
                        }
                      }
                    : undefined
                }
                className={cn(
                  "border-b border-border transition-colors hover:bg-muted/40",
                  zebra && "bg-muted/20",
                  muted && "opacity-60 text-muted-foreground",
                  onRowSelect && "cursor-pointer",
                  isSelected && "bg-primary/10 ring-inset ring-1 ring-primary/30"
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
