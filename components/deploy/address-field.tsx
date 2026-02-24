"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type AddressFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export function AddressField({
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder = "0x...",
  id: idProp,
  required,
  disabled,
  className,
}: AddressFieldProps) {
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
        type="text"
        inputMode="text"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
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
