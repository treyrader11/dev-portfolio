// Tracks which portfolio projects a visitor has already seen, and when, in
// localStorage. Used to order the "Similar projects" rail: unseen projects lead
// (by similarity), already-seen ones trail (by how recently they were seen).

const KEY = "portfolio_visits";

export type ProjectVisits = Record<string, number>; // slug -> last-seen epoch ms

export function readVisits(): ProjectVisits {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : {};
    return parsed && typeof parsed === "object"
      ? (parsed as ProjectVisits)
      : {};
  } catch {
    return {};
  }
}

export function recordVisit(slug: string): void {
  if (typeof window === "undefined" || !slug) return;
  try {
    const visits = readVisits();
    visits[slug] = Date.now();
    window.localStorage.setItem(KEY, JSON.stringify(visits));
  } catch {
    // Private mode / quota — non-fatal; ordering just falls back to similarity.
  }
}
