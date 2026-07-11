"use client";

import { useState } from "react";
import { RiSparkling2Line, RiLoader4Line } from "react-icons/ri";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import {
  FQD_CATEGORIES,
  FQD_CATEGORY_NAMES,
  type FqdCategory,
} from "../types/fqd-types";

interface Props {
  category: string;
  subcategory: string;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
  // The event description, used as the source for AI subcategory generation.
  description?: string;
  title?: string;
}

const SELECT =
  "w-full rounded-lg border border-dark-600 bg-dark-600 px-3 py-2.5 text-sm text-white transition-all focus:outline-none focus:ring-1 focus:ring-secondary disabled:opacity-50";

// Category dropdown + a free-text Subcategory that can be typed, picked from the
// category's suggestions, or auto-generated from the description by AI.
export function CategorySelect({
  category,
  subcategory,
  onCategoryChange,
  onSubcategoryChange,
  description,
  title,
}: Props) {
  const { addNotification } = useNotificationsContext();
  const [generating, setGenerating] = useState(false);

  const subs =
    category && category in FQD_CATEGORIES
      ? FQD_CATEGORIES[category as FqdCategory]
      : [];

  async function generate() {
    if (generating) return;
    if (!description?.trim()) {
      addNotification({
        text: "Add a description first — the AI generates the subcategory from it",
        variant: "error",
      });
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/fqd/generate-subcategory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, title, category }),
      });
      const data = await res.json();
      if (res.ok && data.subcategory) {
        onSubcategoryChange(data.subcategory);
        addNotification({
          text: `Subcategory set to “${data.subcategory}”`,
          variant: "success",
        });
      } else {
        addNotification({
          text: data.error ?? "Couldn't generate a subcategory",
          variant: "error",
        });
      }
    } catch {
      addNotification({
        text: "Couldn't generate a subcategory — request failed",
        variant: "error",
      });
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-white">Category</label>
        <select
          className={SELECT}
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">Select category</option>
          {FQD_CATEGORY_NAMES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white">Subcategory</label>
          <button
            type="button"
            onClick={generate}
            disabled={generating}
            className="inline-flex items-center gap-1 text-xs font-medium text-secondary transition-colors hover:text-secondary/80 disabled:opacity-50"
          >
            {generating ? (
              <RiLoader4Line className="size-3.5 animate-spin" />
            ) : (
              <RiSparkling2Line className="size-3.5" />
            )}
            {generating ? "Generating…" : "AI from description"}
          </button>
        </div>
        <input
          list="fqd-subcategory-suggestions"
          className={SELECT}
          value={subcategory}
          onChange={(e) => onSubcategoryChange(e.target.value)}
          placeholder="Type, pick a suggestion, or generate with AI"
        />
        <datalist id="fqd-subcategory-suggestions">
          {subs.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>
    </div>
  );
}
