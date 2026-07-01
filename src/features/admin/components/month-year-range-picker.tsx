"use client";

import { useMemo, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const FULL_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface MonthYear {
  month: number | null; // 0-11
  year: number | null;
}

const EMPTY: MonthYear = { month: null, year: null };

function parsePart(part: string): MonthYear {
  const m = part.trim().match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (!m) return EMPTY;
  const name = m[1].toLowerCase();
  const idx = FULL_MONTHS.findIndex((f) => f.toLowerCase() === name);
  const abbrIdx = MONTHS.findIndex((a) => a.toLowerCase() === name);
  const month = idx !== -1 ? idx : abbrIdx;
  if (month === -1) return EMPTY;
  return { month, year: Number(m[2]) };
}

// Reads a "MMM YYYY - MMM YYYY" / "MMM YYYY - Present" string into structured
// start/end + the still-here flag. Falsely-formatted strings just parse empty.
function parseRange(value: string): {
  start: MonthYear;
  end: MonthYear;
  stillHere: boolean;
} {
  const parts = value.split(/\s[-–]\s/);
  const start = parts[0] ? parsePart(parts[0]) : EMPTY;
  const endRaw = parts[1]?.trim() ?? "";
  const stillHere = /present|current/i.test(endRaw);
  const end = stillHere ? EMPTY : parsePart(endRaw);
  return { start, end, stillHere };
}

function formatPart(v: MonthYear): string {
  if (v.month === null || v.year === null) return "";
  return `${MONTHS[v.month]} ${v.year}`;
}

// Compact month + year picker in a popover. Year is stepped with arrows; months
// are a 3x4 grid — pick a month and it commits. "Seamless" = no typing.
function MonthYearField({
  value,
  onSelect,
  placeholder,
  disabled,
}: {
  value: MonthYear;
  onSelect: (v: MonthYear) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  const thisYear = new Date().getFullYear();
  const [viewYear, setViewYear] = useState(value.year ?? thisYear);
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "w-full rounded-lg border border-dark-600 px-3 py-2 text-left text-sm transition-colors",
            disabled
              ? "cursor-not-allowed text-light-400/50"
              : "text-white hover:border-secondary/60",
          )}
        >
          {formatPart(value) || (
            <span className="text-light-400">{placeholder}</span>
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          className="z-[110] w-60 rounded-xl border border-dark-600 bg-dark-500 p-3 shadow-xl"
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewYear((y) => y - 1)}
              className="rounded p-1 text-light-400 hover:text-white"
              aria-label="Previous year"
            >
              <RiArrowLeftSLine className="size-5" />
            </button>
            <span className="text-sm font-medium text-white">{viewYear}</span>
            <button
              type="button"
              onClick={() => setViewYear((y) => y + 1)}
              className="rounded p-1 text-light-400 hover:text-white"
              aria-label="Next year"
            >
              <RiArrowRightSLine className="size-5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {MONTHS.map((m, i) => {
              const selected = value.month === i && value.year === viewYear;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    onSelect({ month: i, year: viewYear });
                    setOpen(false);
                  }}
                  className={cn(
                    "rounded-md px-2 py-1.5 text-xs transition-colors",
                    selected
                      ? "bg-secondary text-white"
                      : "text-light-400 hover:bg-dark-400 hover:text-white",
                  )}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function MonthYearRangePicker({ label, value, onChange }: Props) {
  const parsed = useMemo(() => parseRange(value), [value]);

  function emit(
    start: MonthYear,
    end: MonthYear,
    stillHere: boolean,
  ) {
    const startStr = formatPart(start);
    const endStr = stillHere ? "Present" : formatPart(end);
    if (!startStr && !endStr) {
      onChange("");
      return;
    }
    onChange(`${startStr}${startStr || endStr ? " - " : ""}${endStr}`);
  }

  return (
    <div className="col-span-2">
      <label className="block text-sm font-medium text-white mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <MonthYearField
          value={parsed.start}
          placeholder="Start"
          onSelect={(v) => emit(v, parsed.end, parsed.stillHere)}
        />
        <span className="text-light-400">–</span>
        <MonthYearField
          value={parsed.end}
          placeholder="End"
          disabled={parsed.stillHere}
          onSelect={(v) => emit(parsed.start, v, false)}
        />
      </div>

      <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-sm text-light-400">
        <input
          type="checkbox"
          checked={parsed.stillHere}
          onChange={(e) => emit(parsed.start, parsed.end, e.target.checked)}
          className="size-4 accent-secondary"
        />
        Still work here?
      </label>
    </div>
  );
}
