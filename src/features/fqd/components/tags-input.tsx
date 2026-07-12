"use client";

import { useState } from "react";
import { RiSparkling2Line, RiLoader4Line } from "react-icons/ri";
import { Chip, type ChipVariant } from "@/components/ui/chip";

interface Props {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  onAi?: () => void;
  aiLoading?: boolean;
  aiLabel?: string;
  chipVariant?: ChipVariant;
}

// A pill/tag input: existing values show as removable badges; typing + Enter (or
// comma) adds a new one. Optional AI button + datalist suggestions.
export function TagsInput({
  label,
  values,
  onChange,
  suggestions = [],
  placeholder,
  onAi,
  aiLoading,
  aiLabel = "AI from description",
  chipVariant = "secondary",
}: Props) {
  const [draft, setDraft] = useState("");
  const listId = `${label.toLowerCase().replace(/\s+/g, "-")}-suggestions`;

  function add(raw: string) {
    const v = raw.trim();
    if (!v) return;
    if (!values.some((x) => x.toLowerCase() === v.toLowerCase())) {
      onChange([...values, v]);
    }
    setDraft("");
  }

  function remove(v: string) {
    onChange(values.filter((x) => x !== v));
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white">{label}</label>
        {onAi && (
          <button
            type="button"
            onClick={onAi}
            disabled={aiLoading}
            className="inline-flex items-center gap-1 text-xs font-medium text-secondary transition-colors hover:text-secondary/80 disabled:opacity-50"
          >
            {aiLoading ? (
              <RiLoader4Line className="size-3.5 animate-spin" />
            ) : (
              <RiSparkling2Line className="size-3.5" />
            )}
            {aiLoading ? "Generating…" : aiLabel}
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-dark-600 bg-dark-600 px-2 py-2 focus-within:ring-1 focus-within:ring-secondary">
        {values.map((v) => (
          <Chip
            key={v}
            variant={chipVariant}
            onRemove={() => remove(v)}
            removeLabel={`Remove ${v}`}
          >
            {v}
          </Chip>
        ))}
        <input
          list={suggestions.length ? listId : undefined}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && values.length) {
              remove(values[values.length - 1]);
            }
          }}
          onBlur={() => add(draft)}
          placeholder={values.length ? "" : (placeholder ?? "Type and press Enter…")}
          className="min-w-[8rem] flex-1 bg-transparent px-1 py-0.5 text-sm text-white outline-none placeholder:text-light-400"
        />
      </div>

      {suggestions.length > 0 && (
        <datalist id={listId}>
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      )}
    </div>
  );
}
