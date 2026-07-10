import { useCallback, useEffect, useState } from "react";

export interface RecentSearchItem {
  title: string;
  subtitle?: string;
  href: string;
  group: string;
}

const KEY = "admin:recent-searches";
const MAX = 10;

// Persists the last MAX search results the admin selected, most-recent first
// (re-selecting an item moves it back to the top). Client-only (localStorage),
// so it never touches the server or any AI quota.
export function useRecentSearches() {
  const [recent, setRecent] = useState<RecentSearchItem[]>([]);

  // Load once on mount (client-side only, so no SSR/hydration mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setRecent(JSON.parse(raw) as RecentSearchItem[]);
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  const addRecent = useCallback((item: RecentSearchItem) => {
    setRecent((prev) => {
      const next = [
        item,
        ...prev.filter((i) => i.href !== item.href),
      ].slice(0, MAX);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore quota/availability errors */
      }
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecent([]);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return { recent, addRecent, clearRecent };
}
