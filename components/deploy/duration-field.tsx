"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const SECONDS_PER_DAY = 86400;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_MINUTE = 60;

function totalSecondsToParts(total: number): {
  days: number;
  hours: number;
  minutes: number;
} {
  let remainder = Math.max(0, Math.floor(total));
  const days = Math.floor(remainder / SECONDS_PER_DAY);
  remainder -= days * SECONDS_PER_DAY;
  const hours = Math.floor(remainder / SECONDS_PER_HOUR);
  remainder -= hours * SECONDS_PER_HOUR;
  const minutes = Math.floor(remainder / SECONDS_PER_MINUTE);
  return { days, hours, minutes };
}

function partsToTotalSeconds(days: number, hours: number, minutes: number): number {
  return (
    days * SECONDS_PER_DAY +
    hours * SECONDS_PER_HOUR +
    minutes * SECONDS_PER_MINUTE
  );
}

export type DurationFieldProps = {
  label: string;
  /** Total duration in seconds. */
  value: number;
  onChange: (totalSeconds: number) => void;
  onBlur?: () => void;
  error?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export function DurationField({
  label,
  value,
  onChange,
  onBlur,
  error,
  id: idProp,
  required,
  disabled,
  className,
}: DurationFieldProps) {
  const id = React.useId();
  const fieldId = idProp ?? id;

  const { days, hours, minutes } = totalSecondsToParts(value);

  const update = React.useCallback(
    (d: number, h: number, m: number) => {
      onChange(partsToTotalSeconds(d, h, m));
    },
    [onChange]
  );

  const handleDaysChange = (v: string) => {
    const n = parseInt(v, 10) || 0;
    update(n, hours, minutes);
  };
  const handleHoursChange = (v: string) => {
    const n = parseInt(v, 10) || 0;
    update(days, n, minutes);
  };
  const handleMinutesChange = (v: string) => {
    const n = parseInt(v, 10) || 0;
    update(days, hours, n);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-describedby={error ? `${fieldId}-error` : undefined}
        aria-invalid={!!error}
        onBlur={onBlur}
      >
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min={0}
            step={1}
            placeholder="0"
            value={days || ""}
            onChange={(e) => handleDaysChange(e.target.value)}
            disabled={disabled}
            className="w-20"
            aria-label="Days"
          />
          <span className="text-sm text-muted-foreground">days</span>
        </div>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min={0}
            max={23}
            step={1}
            placeholder="0"
            value={hours || ""}
            onChange={(e) => handleHoursChange(e.target.value)}
            disabled={disabled}
            className="w-20"
            aria-label="Hours"
          />
          <span className="text-sm text-muted-foreground">hours</span>
        </div>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min={0}
            max={59}
            step={1}
            placeholder="0"
            value={minutes || ""}
            onChange={(e) => handleMinutesChange(e.target.value)}
            disabled={disabled}
            className="w-20"
            aria-label="Minutes"
          />
          <span className="text-sm text-muted-foreground">min</span>
        </div>
      </div>
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
