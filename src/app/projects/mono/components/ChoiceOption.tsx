"use client";

import { useId } from "react";
import { Check } from "lucide-react";

export interface ChoiceOptionProps {
  mode: "radio" | "checkbox";
  label: string;
  name: string;
  value: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

/** Full-row, accessible radio/checkbox option used by single- and multi-choice cards. */
export default function ChoiceOption({
  mode,
  label,
  name,
  value,
  checked,
  disabled = false,
  onCheckedChange,
}: ChoiceOptionProps) {
  const id = useId();
  const isRadio = mode === "radio";

  return (
    <label
      htmlFor={id}
      className={`flex min-h-12 items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-sm transition-colors ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      } ${
        checked
          ? "border-border-strong bg-surface-hover text-text-primary"
          : "border-border-default bg-surface text-text-primary hover:bg-surface-hover"
      }`}
    >
      <input
        id={id}
        type={mode}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`grid h-5 w-5 shrink-0 place-items-center border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-text-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface ${
          isRadio ? "rounded-full" : "rounded-[5px]"
        } ${
          checked
            ? "border-action-primary bg-action-primary text-white"
            : "border-border-control bg-surface text-transparent"
        }`}
      >
        {isRadio ? (
          <span className={`h-2 w-2 rounded-full bg-white transition-transform ${checked ? "scale-100" : "scale-0"}`} />
        ) : checked ? (
          <Check size={13} strokeWidth={2.5} />
        ) : null}
      </span>
      <span className="min-w-0 flex-1">{label}</span>
    </label>
  );
}
