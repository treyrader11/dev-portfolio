"use client";

import { RiArrowDownSLine, RiLoader4Line } from "react-icons/ri";
import { cn } from "@/lib/utils";
import {
  FQD_STATUSES,
  FQD_STATUS_BADGE,
  FQD_STATUS_LABEL,
  type FqdStatus,
} from "../types/fqd-types";

// Compact inline status control shown on each event card / list row. A native
// <select> styled as a colored status pill — works identically on desktop and
// mobile (and avoids the overflow/z-index issues a popover would hit inside the
// card grid). Changing it fires onChange with the new status.
export function EventStatusSelect({
  value,
  onChange,
  busy,
  className,
}: {
  value: FqdStatus;
  onChange: (status: FqdStatus) => void;
  busy?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <select
        value={value}
        onChange={(e) => {
          const next = e.target.value as FqdStatus;
          if (next !== value) onChange(next);
        }}
        disabled={busy}
        aria-label="Event status"
        title="Change workflow status"
        // pr leaves room for the chevron; text-base on mobile avoids iOS zoom.
        className={cn(
          "cursor-pointer appearance-none rounded-full py-0.5 pl-2.5 pr-6 text-xs font-medium outline-none [color-scheme:dark] disabled:opacity-60",
          FQD_STATUS_BADGE[value],
        )}
      >
        {FQD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {FQD_STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      {busy ? (
        <RiLoader4Line className="pointer-events-none absolute right-1.5 top-1/2 size-3.5 -translate-y-1/2 animate-spin opacity-80" />
      ) : (
        <RiArrowDownSLine className="pointer-events-none absolute right-1 top-1/2 size-3.5 -translate-y-1/2 opacity-70" />
      )}
    </div>
  );
}
