"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type NumberFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  step?: string;
  className?: string;
};

export function NumberField({
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  id: idProp,
  required,
  disabled,
  min,
  step = "1",
  className,
}: NumberFieldProps) {
  const id = React.useId();
  const fieldId = idProp ?? id;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={fieldId}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Input
        id={fieldId}
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={error ? "border-destructive" : undefined}
      />
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
