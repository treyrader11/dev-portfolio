"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import {
  RiSearchLine,
  RiLoader4Line,
  RiTimeLine,
  RiCloseLine,
} from "react-icons/ri";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useRecentSearches,
  type RecentSearchItem,
} from "@/hooks/useRecentSearches";
import { cn } from "@/lib/utils";
import type { GlobalSearchResults } from "@/pages/api/admin/search";

interface Group {
  title: string;
  items: RecentSearchItem[];
}

// Flatten the API results into labeled groups of a common item shape.
function toGroups(results: GlobalSearchResults): Group[] {
  return [
    {
      title: "Events",
      items: results.events.map((e) => ({
        title: e.title,
        subtitle: e.subtitle,
        href: e.href,
        group: "Events",
      })),
    },
    {
      title: "Projects",
      items: results.projects.map((p) => ({
        title: p.title,
        subtitle: p.subtitle,
        href: p.href,
        group: "Projects",
      })),
    },
    {
      title: "GitHub repos",
      items: results.repos.map((r) => ({
        title: r.name,
        subtitle: r.subtitle,
        href: r.href,
        group: "GitHub repos",
      })),
    },
  ];
}

// Shared search state: debounced fetching, recent searches, and the derived
// groups/flags both the desktop dropdown and the mobile modal render from.
function useGlobalSearch() {
  const [value, setValue] = useState("");
  // 400ms debounce so a burst of keystrokes fires a single request.
  const debounced = useDebounce(value, 400);
  const [results, setResults] = useState<GlobalSearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const lastFetched = useRef<string>("");
  const { recent, addRecent, clearRecent } = useRecentSearches();

  const ready = debounced.trim().length >= 2;

  // Fetch on the debounced query — skipping a query identical to the last one
  // we already fetched (e.g. typing then deleting back to the same term).
  useEffect(() => {
    const q = debounced.trim();
    if (q.length < 2) {
      setResults(null);
      return;
    }
    if (q === lastFetched.current) return;
    lastFetched.current = q;

    let active = true;
    setLoading(true);
    fetch(`/api/admin/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data: GlobalSearchResults) => active && setResults(data))
      .catch(() => active && setResults(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [debounced]);

  const groups = results ? toGroups(results) : [];
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const showRecent = !ready && recent.length > 0;

  return {
    value,
    setValue,
    loading,
    ready,
    groups,
    total,
    recent,
    addRecent,
    clearRecent,
    showRecent,
  };
}

// Desktop: inline search box on the right of the header with a slide-down
// dropdown. Hidden on mobile, where GlobalSearchMobile takes over.
export function GlobalSearch() {
  const s = useGlobalSearch();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Close on outside click.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // ⌘K / Ctrl+K opens the search and focuses the input.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Clear + close when navigating to a result.
  useEffect(() => {
    const close = () => {
      setOpen(false);
      s.setValue("");
    };
    router.events.on("routeChangeStart", close);
    return () => router.events.off("routeChangeStart", close);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.events]);

  return (
    <div
      ref={containerRef}
      className="relative hidden w-full max-w-xs sm:block sm:max-w-sm"
    >
      <div className="flex items-center gap-2 rounded-lg border border-dark-600 bg-dark-600 px-3 py-2 focus-within:border-secondary/60">
        <RiSearchLine className="size-4 shrink-0 text-light-400" />
        <input
          ref={inputRef}
          value={s.value}
          onChange={(e) => s.setValue(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          placeholder="Search events, projects, repos…"
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-light-400"
        />
        {s.loading ? (
          <RiLoader4Line className="size-4 shrink-0 animate-spin text-light-400" />
        ) : (
          <kbd className="pointer-events-none hidden shrink-0 rounded border border-dark-600 px-1.5 py-0.5 text-[10px] font-medium text-light-400 md:inline">
            ⌘K
          </kbd>
        )}
      </div>

      {/* Slides down (vouzot per-item animation). Live results while typing, or
          recent searches when the box is focused and empty. */}
      <AnimatePresence>
        {open && (s.ready || s.showRecent) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute inset-x-0 z-50 mt-2 max-h-[70vh] overflow-auto rounded-lg border border-dark-600 bg-dark-500 p-2 shadow-2xl"
          >
            <SearchBody search={s} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mobile: a search icon (placed on the LEFT of the header) that opens a
// full-width modal with the search box, recent searches, and live results.
// Hidden on desktop.
export function GlobalSearchMobile() {
  const s = useGlobalSearch();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Close + clear when navigating to a result.
  useEffect(() => {
    const close = () => {
      setOpen(false);
      s.setValue("");
    };
    router.events.on("routeChangeStart", close);
    return () => router.events.off("routeChangeStart", close);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.events]);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="flex size-9 items-center justify-center rounded-lg border border-dark-600 bg-dark-600 text-light-400 transition-colors hover:border-secondary/60 hover:text-white"
      >
        <RiSearchLine className="size-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70]"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="relative mx-auto mt-14 flex max-h-[80vh] w-[92%] max-w-md flex-col overflow-hidden rounded-xl border border-dark-600 bg-dark-500 shadow-2xl"
            >
              <div className="flex items-center gap-2 border-b border-dark-600 px-3 py-3">
                <RiSearchLine className="size-4 shrink-0 text-light-400" />
                {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
                <input
                  autoFocus
                  value={s.value}
                  onChange={(e) => s.setValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
                  placeholder="Search events, projects, repos…"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-light-400"
                />
                {s.loading && (
                  <RiLoader4Line className="size-4 shrink-0 animate-spin text-light-400" />
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close search"
                  className="shrink-0 text-light-400 hover:text-white"
                >
                  <RiCloseLine className="size-5" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-auto p-2">
                {s.ready || s.showRecent ? (
                  <SearchBody search={s} />
                ) : (
                  <p className="px-2 py-6 text-center text-sm text-light-400">
                    Search events, projects, and GitHub repos.
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// The shared body: live results when the query is ready, otherwise the recent
// searches list. Used by both the desktop dropdown and the mobile modal.
function SearchBody({
  search,
}: {
  search: ReturnType<typeof useGlobalSearch>;
}) {
  const { ready, total, groups, loading, recent, addRecent, clearRecent } =
    search;

  if (ready) {
    return total === 0 ? (
      <p className="px-2 py-3 text-sm text-light-400">
        {loading ? "Searching…" : "No matches."}
      </p>
    ) : (
      <ResultList groups={groups} onSelect={addRecent} />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between px-2 pb-1 pt-2">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-light-400">
          <RiTimeLine className="size-3" />
          Recent searches
        </p>
        <button
          type="button"
          onClick={clearRecent}
          className="text-[10px] uppercase tracking-wide text-light-400 hover:text-white"
        >
          Clear
        </button>
      </div>
      {recent.map((item, i) => (
        <Row key={item.href} i={i} item={item} onSelect={addRecent} />
      ))}
    </div>
  );
}

function ResultList({
  groups,
  onSelect,
}: {
  groups: Group[];
  onSelect: (item: RecentSearchItem) => void;
}) {
  // Running index so the stagger cascades across all groups, not per-group.
  let index = 0;
  return (
    <div className="space-y-1">
      {groups.map((g) =>
        g.items.length === 0 ? null : (
          <div key={g.title}>
            <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-light-400">
              {g.title}
            </p>
            {g.items.map((item) => (
              <Row
                key={item.href}
                i={index++}
                item={item}
                onSelect={onSelect}
              />
            ))}
          </div>
        ),
      )}
    </div>
  );
}

// Each result slides down + fades in (vouzot's exact per-item animation), with a
// small stagger. Selecting it records it as a recent search.
function Row({
  i,
  item,
  onSelect,
}: {
  i: number;
  item: RecentSearchItem;
  onSelect: (item: RecentSearchItem) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04, duration: 0.25 }}
    >
      <Link
        href={item.href}
        onClick={() => onSelect(item)}
        className={cn(
          "flex items-center justify-between gap-3 rounded-md px-2 py-2",
          "transition-colors hover:bg-dark-600",
        )}
      >
        <span className="truncate text-sm text-white">{item.title}</span>
        {item.subtitle && (
          <span className="shrink-0 truncate text-xs text-light-400">
            {item.subtitle}
          </span>
        )}
      </Link>
    </motion.div>
  );
}
