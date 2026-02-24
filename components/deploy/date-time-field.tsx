"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/** Value is Unix timestamp in seconds, or null if not set. */
export type DateTimeFieldProps = {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  onBlur?: () => void;
  error?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  /** Minimum allowed timestamp (seconds). e.g. current time for start time. */
  minTimestamp?: number;
  className?: string;
};

function toDate(timestampSeconds: number | null): Date | undefined {
  if (timestampSeconds == null || timestampSeconds <= 0) return undefined;
  return new Date(timestampSeconds * 1000);
}

function toTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export function DateTimeField({
  label,
  value,
  onChange,
  onBlur,
  error,
  id: idProp,
  required,
  disabled,
  minTimestamp,
  className,
}: DateTimeFieldProps) {
  const id = React.useId();
  const fieldId = idProp ?? id;
  const [open, setOpen] = React.useState(false);

  const handleOpenChange = (next: boolean) => {
    if (!next) onBlur?.();
    setOpen(next);
  };

  const date = toDate(value);
  const dateOnly = date
    ? new Date(date.getFullYear(), date.getMonth(), date.getDate())
    : undefined;
  const hour = date ? date.getHours() : 0;
  const minute = date ? date.getMinutes() : 0;

  const minDate = minTimestamp != null ? toDate(minTimestamp) : undefined;

  const handleDateSelect = (d: Date | undefined) => {
    if (!d) {
      onChange(null);
      return;
    }
    const combined = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      hour,
      minute,
      0,
      0
    );
    onChange(toTimestamp(combined));
  };

  const handleTimeChange = (h: number, m: number) => {
    const base = dateOnly ?? new Date();
    const d = dateOnly ?? new Date();
    const combined = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      h,
      m,
      0,
      0
    );
    onChange(toTimestamp(combined));
  };

  const displayText = value != null && value > 0
    ? format(new Date(value * 1000), "PPp")
    : "Pick date and time";

  return (
    <div className={cn("space-y-2", className)}>
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              error && "border-destructive"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {displayText}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateOnly}
            onSelect={(d) => handleDateSelect(d)}
            disabled={(d) => {
              if (minDate) return d < minDate;
              return false;
            }}
            initialFocus
          />
          <div className="flex items-center gap-2 border-t p-3">
            <label className="text-sm text-muted-foreground">Time</label>
            <input
              type="time"
              value={`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`}
              onChange={(e) => {
                const [h, m] = e.target.value.split(":").map(Number);
                handleTimeChange(h, m);
              }}
              className="rounded-md border border-input bg-transparent px-2 py-1 text-sm"
            />
          </div>
        </PopoverContent>
      </Popover>
      {error && (
        <p
          id={`${fieldId}-error`}
          className="text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
