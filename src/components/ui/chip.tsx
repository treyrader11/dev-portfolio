"use client";

import { type ReactNode } from "react";
import { RiCloseLine } from "react-icons/ri";
import { cn } from "@/lib/utils";

export type ChipVariant =
  | "amber"
  | "secondary"
  | "lime"
  | "neutral"
  | "success"
  | "error"
  | "info";

const CHIP_VARIANT: Record<ChipVariant, string> = {
  amber: "bg-amber-400/15 text-amber-300",
  secondary: "bg-secondary/15 text-secondary",
  lime: "bg-lime-400/15 text-lime-300",
  neutral: "bg-light-400/15 text-light-400",
  success: "bg-success/15 text-success",
  error: "bg-error/15 text-error",
  info: "bg-sky-500/15 text-sky-400",
};

interface ChipProps {
  children: ReactNode;
  variant?: ChipVariant;
  className?: string;
  // When provided, renders a trailing "×" that calls this on click.
  onRemove?: () => void;
  removeLabel?: string;
}

// Reusable pill/chip. Pass a variant for the color, or a className to override.
export function Chip({
  children,
  variant = "neutral",
  className,
  onRemove,
  removeLabel,
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        CHIP_VARIANT[variant],
        className,
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label={removeLabel ?? "Remove"}
          onClick={onRemove}
          className="-mr-0.5 opacity-70 transition-opacity hover:opacity-100"
        >
          <RiCloseLine className="size-3.5" />
        </button>
      )}
    </span>
  );
}
