"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  RiArrowDownSLine,
  RiCheckLine,
  RiAddLine,
  RiCloseLine,
} from "react-icons/ri";
import type { Suggestion } from "./tag-input-field";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options?: Suggestion[];
  inline?: boolean;
}

// Multi-select modeled on roux-ui's CategorySelector UX: a trigger opens a
// dropdown with a search box and a filtered list of existing values; clicking an
// option toggles it, and a search with no match offers an "Add" affordance to
// create a new value. Selected values render as removable chips. Dark-styled.
export function CategoryMultiField({
  label,
  value,
  onChange,
  options = [],
  inline = false,
}: Props) {
  const selected = value.filter(Boolean);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // The pickable list is the union of existing options and current selections.
  const allValues = useMemo(() => {
    const set = new Map<string, number>();
    for (const o of options) set.set(o.value, o.count);
    for (const s of selected) if (!set.has(s)) set.set(s, 0);
    return Array.from(set.entries()).map(([value, count]) => ({ value, count }));
  }, [options, selected]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allValues.filter((o) => o.value.toLowerCase().includes(q));
  }, [allValues, search]);

  const exactMatch = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q.length > 0 && allValues.some((o) => o.value.toLowerCase() === q);
  }, [allValues, search]);

  const canAdd = search.trim().length > 0 && !exactMatch;

  function toggle(option: string) {
    if (selected.includes(option)) onChange(selected.filter((s) => s !== option));
    else onChange([...selected, option]);
  }

  function addFromSearch() {
    const v = search.trim();
    if (!v || selected.includes(v)) return;
    onChange([...selected, v]);
    setSearch("");
  }

  return (
    <div className={cn(inline && "flex items-start gap-4")}>
      <label
        className={cn(
          "text-sm font-medium text-white",
          inline ? "w-44 shrink-0 whitespace-nowrap pt-2" : "block mb-1 whitespace-nowrap",
        )}
      >
        {label}
      </label>

      <div ref={containerRef} className={cn("relative", inline && "min-w-0 flex-1")}>
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-lg border border-dark-600 px-3 py-2 text-left text-sm transition-colors hover:border-secondary/60"
        >
          <span className={selected.length ? "text-white" : "text-light-400"}>
            {selected.length
              ? `${selected.length} selected`
              : "Select technology features"}
          </span>
          <RiArrowDownSLine
            className={cn(
              "size-4 text-light-400 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {/* Selected chips */}
        {selected.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selected.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1 rounded-md bg-dark-600 px-2 py-1 text-sm text-white"
              >
                {s}
                <button
                  type="button"
                  onClick={() => toggle(s)}
                  aria-label={`Remove ${s}`}
                  className="rounded p-0.5 text-light-400 transition-colors hover:text-white"
                >
                  <RiCloseLine className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {isOpen && (
          <div className="absolute z-50 mt-2 flex max-h-80 w-full flex-col overflow-hidden rounded-lg border border-dark-600 bg-dark-500 shadow-lg">
            <div className="border-b border-dark-600 p-2">
              <div className="relative">
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canAdd) {
                      e.preventDefault();
                      addFromSearch();
                    }
                  }}
                  placeholder="Search features..."
                  className={cn(
                    "w-full rounded-lg border border-dark-600 bg-dark-400 px-3 py-2 text-sm text-white outline-none placeholder:text-light-400",
                    canAdd && "pr-16",
                  )}
                />
                {canAdd && (
                  <button
                    type="button"
                    onClick={addFromSearch}
                    className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-secondary/80"
                  >
                    <RiAddLine className="size-3" />
                    Add
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-1">
              {filtered.length > 0 ? (
                filtered.map((o) => {
                  const isSelected = selected.includes(o.value);
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => toggle(o.value)}
                      className={cn(
                        "flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-dark-400",
                        isSelected ? "text-secondary" : "text-white",
                      )}
                    >
                      <span>{o.value}</span>
                      {isSelected && <RiCheckLine className="size-4" />}
                    </button>
                  );
                })
              ) : (
                <div className="py-6 text-center text-sm text-light-400">
                  No features found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
