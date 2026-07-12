import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { FqdDuplicateInfo } from "../types/fqd-types";

interface IndexRow extends FqdDuplicateInfo {
  slugKey: string;
  day: string;
}

// Build a lookup of existing events for duplicate detection. The table is small,
// so a single scan is cheap and lets a bulk import check many candidates without
// running one query per event.
export async function loadDuplicateIndex(
  excludeId?: string,
): Promise<IndexRow[]> {
  const rows = await prisma.fqdEvent.findMany({
    where: excludeId ? { id: { not: excludeId } } : {},
    select: { id: true, title: true, slug: true, startDate: true },
  });
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    startDate: r.startDate.toISOString(),
    slugKey: slugify(r.title),
    day: r.startDate.toISOString().slice(0, 10),
  }));
}

// An event is a duplicate when its title (normalized to a slug, so case /
// punctuation / spacing don't matter) matches an existing event AND, when a
// start date is given, they fall on the same calendar day. Recurring events on
// different days are therefore NOT duplicates.
export function matchDuplicate(
  index: IndexRow[],
  title: string,
  startDate?: string | null,
): FqdDuplicateInfo | null {
  const targetSlug = slugify(title || "");
  if (!targetSlug) return null;
  const day = startDate ? startDate.slice(0, 10) : null;
  const found = index.find(
    (r) => r.slugKey === targetSlug && (!day || r.day === day),
  );
  if (!found) return null;
  return {
    id: found.id,
    title: found.title,
    slug: found.slug,
    startDate: found.startDate,
  };
}

// A looser key than slugify for "same event, slightly different wording"
// matching: it drops a year (19xx/20xx), ordinal/edition markers ("2nd", "34th"),
// the word "annual", and leading articles, so "Running of the Bulls 2026" and
// "Running of the Bulls", or "36th Annual Oak Street Po-Boy Festival" and "Oak
// Street Po-Boy Festival", collapse to the same key. Used to dedupe discovered
// events against what already exists.
export function fuzzyTitleKey(title: string): string {
  return (title || "")
    .toLowerCase()
    .replace(/\b(19|20)\d{2}\b/g, " ") // years
    .replace(/\b\d+\s*(st|nd|rd|th)\b/g, " ") // ordinals: 2nd, 34th
    .replace(/\bannual\b/g, " ")
    .replace(/\b(the|a|an)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, "-");
}

export async function findDuplicateEvent(
  title: string,
  startDate?: string | null,
  excludeId?: string,
): Promise<FqdDuplicateInfo | null> {
  const index = await loadDuplicateIndex(excludeId);
  return matchDuplicate(index, title, startDate);
}
