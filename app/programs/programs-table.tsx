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
import { ArrowDown, ArrowUp, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import {
  getBlockExplorerAddressUrl,
  cn,
  formatTokenAmount,
  formatDate,
  truncateAddress,
} from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCappedMinterData, type ProgramRow } from "@/lib/hooks/useCappedMinterData";

type ProgramsTableProps = {
  /** When a row is clicked, this root becomes the selected one (e.g. for graph). */
  onRowSelect?: (row: ProgramRow) => void;
  /** Root address of the currently selected program; row is highlighted when it matches. */
  selectedRootAddress?: `0x${string}` | null;
};

export function ProgramsTable({
  onRowSelect,
  selectedRootAddress = null,
}: ProgramsTableProps = {}) {
  const { rows, isPending, error } = useCappedMinterData();
  // Start with API-provided ordering (status, then startTime). Users can override via column headers.
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<ProgramRow>[]>(
    () => [
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const config =
            status === "active"
              ? {
                  label: "Active",
                  Icon: CheckCircle2,
                  className:
                    "border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200",
                }
              : status === "fullyUsed"
                ? {
                    label: "Fully used",
                    Icon: AlertTriangle,
                    className:
                      "border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200",
                  }
                : {
                    label: "Expired",
                    Icon: XCircle,
                    className:
                      "border-red-400 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200",
                  };

          const { Icon } = config;

          return (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
                config.className
              )}
            >
              <Icon className="size-3.5" aria-hidden />
              {config.label}
            </span>
          );
        },
      },
      {
        accessorKey: "name",
        header: "Token Program Proposal",
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
        header: "Parent Address",
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
        accessorKey: "usagePercent",
        header: "Total Minted",
        cell: ({ row }) => {
          const { minted, cap } = row.original;
          const amount = formatTokenAmount(minted);
          const approved = formatTokenAmount(cap);
          const remaining =
            cap > minted ? formatTokenAmount(cap - minted) : "0 ZK";
          const pct = row.original.usagePercent;
          const pctText =
            pct % 1 === 0 ? `${Math.round(pct)}%` : `${pct.toFixed(1)}%`;
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="whitespace-nowrap">
                    {amount}
                    <span className="text-muted-foreground ml-1">
                      ({pctText})
                    </span>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground text-xs">
                        Approved
                      </span>
                      <span className="text-xs">{approved}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground text-xs">
                        Remaining
                      </span>
                      <span className="text-xs">{remaining}</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
      },
      {
        accessorKey: "cap",
        header: "Total Cap",
        cell: ({ row }) => (
          <span className="whitespace-nowrap">
            {formatTokenAmount(row.original.cap)}
          </span>
        ),
      },
      {
        id: "startTime",
        header: "Start",
        accessorFn: (row) => {
          const { startTime } = row;
          return startTime || undefined;
        },
        sortUndefined: "last",
        cell: ({ row }) => {
          const { startTime } = row.original;
          if (!startTime) {
            return (
              <span className="text-muted-foreground whitespace-nowrap">
                N/A
              </span>
            );
          }

          return (
            <span className="whitespace-nowrap">
              {formatDate(startTime)}
            </span>
          );
        },
      },
      {
        id: "expirationTime",
        header: "End",
        accessorFn: (row) => {
          const { expirationTime } = row;
          return expirationTime || undefined;
        },
        sortUndefined: "last",
        cell: ({ row }) => {
          const { expirationTime } = row.original;
          if (!expirationTime) {
            return (
              <span className="text-muted-foreground whitespace-nowrap">
                N/A
              </span>
            );
          }

          return (
            <span className="whitespace-nowrap">
              {formatDate(expirationTime)}
            </span>
          );
        },
      },
    ],
    []
  );

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
      <table className="w-full text-left text-xs md:text-sm">
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
                      "px-3 py-2.5 font-semibold text-foreground",
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
            const muted = row.original.status !== "active";
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
                  <td key={cell.id} className="px-3 py-2.5">
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
