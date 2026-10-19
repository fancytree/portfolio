"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { MouseEvent } from "react";

export interface RegistryButtonProps {
  props: {
    label?: string;
    variant?: "primary" | "secondary" | "ghost" | "icon" | string;
    size?: "sm" | "md" | "lg" | "icon" | string;
    prompt?: string;
    icon?: "pencil" | "trash";
    tone?: "neutral" | "danger";
    ariaLabel?: string;
    title?: string;
    className?: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  };
  emit?: (action: string, payload?: { prompt?: string }) => void;
}

export default function RegistryButton({ props, emit }: RegistryButtonProps) {
  const isIconButton = props.variant === "icon" || props.size === "icon";
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";
  const sizeClass =
    isIconButton
      ? props.size === "sm" ? "size-7 p-1.5" : "size-8 p-1.5"
      : props.size === "sm"
      ? "min-h-9 px-3 py-1.5 text-xs"
      : props.size === "lg"
      ? "min-h-11 px-5 py-2.5 text-sm"
      : "min-h-10 px-4 py-2 text-sm";
  const variantClass =
    props.variant === "primary"
      ? "border border-action-border bg-action-primary text-white hover:bg-action-hover"
      : props.variant === "ghost"
      ? "text-text-primary hover:bg-surface-hover active:bg-surface-muted"
      : props.variant === "icon"
      ? props.tone === "danger"
        ? "text-status-danger hover:bg-status-danger/10 active:bg-status-danger/15"
        : "text-text-secondary hover:bg-action-primary/10 hover:text-text-brand active:bg-action-primary/15"
      : "border border-border-control bg-surface text-text-primary hover:bg-surface-hover";
  const hasPrompt = typeof props.prompt === "string";
  return (
    <button
      type="button"
      className={`${base} ${sizeClass} ${variantClass} ${props.className ?? ""}`}
      aria-label={props.ariaLabel}
      title={props.title}
      onClick={(event) => {
        if (props.onClick) props.onClick(event);
        else if (hasPrompt) emit?.("sendPrompt", { prompt: props.prompt });
        else emit?.("press");
      }}
    >
      {props.icon === "pencil" ? <Pencil aria-hidden="true" size={14} strokeWidth={1.8} /> : null}
      {props.icon === "trash" ? <Trash2 aria-hidden="true" size={14} strokeWidth={1.8} /> : null}
      {props.label}
    </button>
  );
}
