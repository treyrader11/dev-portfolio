"use client";

import { useState } from "react";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import { TagsInput } from "./tags-input";
import {
  FQD_CATEGORIES,
  FQD_CATEGORY_NAMES,
  type FqdCategory,
} from "../types/fqd-types";

interface Props {
  // Category / subcategory are stored comma-joined so each can hold multiple.
  category: string;
  subcategory: string;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
  // Source for AI generation.
  description?: string;
  title?: string;
}

const parseTags = (s: string): string[] =>
  s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

const joinTags = (a: string[]): string => a.join(", ");

// Merge new values into existing ones, case-insensitively de-duped.
function mergeUnique(existing: string[], incoming: string[]): string[] {
  const out = [...existing];
  const seen = new Set(existing.map((x) => x.toLowerCase()));
  for (const v of incoming) {
    const key = v.toLowerCase();
    if (v && !seen.has(key)) {
      seen.add(key);
      out.push(v);
    }
  }
  return out;
}

// Category + Subcategory as multi-value pill inputs. Each can be typed, picked
// from suggestions, or generated from the description by AI.
export function CategorySelect({
  category,
  subcategory,
  onCategoryChange,
  onSubcategoryChange,
  description,
  title,
}: Props) {
  const { addNotification } = useNotificationsContext();
  const [genCat, setGenCat] = useState(false);
  const [genSub, setGenSub] = useState(false);

  const categories = parseTags(category);
  const subcategories = parseTags(subcategory);

  // Subcategory suggestions: the subs for any selected categories, else all.
  const picked = categories.filter(
    (c): c is FqdCategory => c in FQD_CATEGORIES,
  );
  const subSuggestions = Array.from(
    new Set(
      (picked.length ? picked : FQD_CATEGORY_NAMES).flatMap(
        (c) => FQD_CATEGORIES[c] as readonly string[],
      ),
    ),
  );

  async function generate(field: "category" | "subcategory") {
    if (!description?.trim()) {
      addNotification({
        text: "Add a description first — the AI generates from it",
        variant: "error",
      });
      return;
    }
    const setLoading = field === "category" ? setGenCat : setGenSub;
    setLoading(true);
    try {
      const res = await fetch("/api/fqd/generate-classification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, description, title, category }),
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.values) && data.values.length) {
        if (field === "category") {
          onCategoryChange(joinTags(mergeUnique(categories, data.values)));
        } else {
          onSubcategoryChange(joinTags(mergeUnique(subcategories, data.values)));
        }
        addNotification({
          text: `Added ${data.values.length} ${field}${data.values.length === 1 ? "" : "s"}`,
          variant: "success",
        });
      } else {
        addNotification({
          text: data.error ?? `Couldn't generate a ${field}`,
          variant: "error",
        });
      }
    } catch {
      addNotification({
        text: `Couldn't generate a ${field} — request failed`,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <TagsInput
        label="Category"
        values={categories}
        onChange={(v) => onCategoryChange(joinTags(v))}
        suggestions={FQD_CATEGORY_NAMES as unknown as string[]}
        placeholder="Add a category…"
        onAi={() => generate("category")}
        aiLoading={genCat}
      />
      <TagsInput
        label="Subcategory"
        values={subcategories}
        onChange={(v) => onSubcategoryChange(joinTags(v))}
        suggestions={subSuggestions}
        placeholder="Add a subcategory…"
        onAi={() => generate("subcategory")}
        aiLoading={genSub}
      />
    </div>
  );
}
