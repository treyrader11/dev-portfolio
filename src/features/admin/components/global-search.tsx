"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { RiSearchLine, RiLoader4Line } from "react-icons/ri";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import type { GlobalSearchResults } from "@/pages/api/admin/search";

export function GlobalSearch() {
  const [value, setValue] = useState("");
  const debounced = useDebounce(value, 300);
  const [results, setResults] = useState<GlobalSearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const ready = debounced.trim().length >= 2;

  // Fetch on the debounced query.
  useEffect(() => {
    const q = debounced.trim();
    if (q.length < 2) {
      setResults(null);
      return;
    }
    let active = true;
    setLoading(true);
    fetch(`/api/admin/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data: GlobalSearchResults) => {
        if (active) {
          setResults(data);
          setOpen(true);
        }
      })
      .catch(() => active && setResults(null))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [debounced]);

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

  // Clear + close when navigating to a result.
  useEffect(() => {
    const close = () => {
      setOpen(false);
      setValue("");
    };
    router.events.on("routeChangeStart", close);
    return () => router.events.off("routeChangeStart", close);
  }, [router.events]);

  const total = results
    ? results.events.length + results.projects.length + results.repos.length
    : 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-xs sm:max-w-sm">
      <div className="flex items-center gap-2 rounded-lg border border-dark-600 bg-dark-600 px-3 py-2 focus-within:border-secondary/60">
        <RiSearchLine className="size-4 shrink-0 text-light-400" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => ready && setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          placeholder="Search events, projects, repos…"
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-light-400"
        />
        {loading && (
          <RiLoader4Line className="size-4 shrink-0 animate-spin text-light-400" />
        )}
      </div>

      {/* Results slide down (same logic as vouzot's landing search list). */}
      <AnimatePresence>
        {open && ready && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute inset-x-0 z-50 mt-2 max-h-[70vh] overflow-auto rounded-lg border border-dark-600 bg-dark-500 p-2 shadow-2xl"
          >
            {total === 0 ? (
              <p className="px-2 py-3 text-sm text-light-400">
                {loading ? "Searching…" : "No matches."}
              </p>
            ) : (
              <div className="space-y-1">
                <Group title="Events" items={results!.events}>
                  {(e, i) => (
                    <Row
                      key={e.id}
                      i={i}
                      href={e.href}
                      title={e.title}
                      subtitle={e.subtitle}
                    />
                  )}
                </Group>
                <Group title="Projects" items={results!.projects}>
                  {(p, i) => (
                    <Row
                      key={p.href}
                      i={i}
                      href={p.href}
                      title={p.title}
                      subtitle={p.subtitle}
                    />
                  )}
                </Group>
                <Group title="GitHub repos" items={results!.repos}>
                  {(r, i) => (
                    <Row
                      key={r.name}
                      i={i}
                      href={r.href}
                      title={r.name}
                      subtitle={r.subtitle}
                    />
                  )}
                </Group>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Group<T>({
  title,
  items,
  children,
}: {
  title: string;
  items: T[];
  children: (item: T, i: number) => ReactNode;
}) {
  if (!items.length) return null;
  return (
    <div>
      <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-light-400">
        {title}
      </p>
      {items.map((item, i) => children(item, i))}
    </div>
  );
}

// Each result slides down + fades in — vouzot's exact per-item animation, with a
// small stagger so the list cascades.
function Row({
  i,
  href,
  title,
  subtitle,
}: {
  i: number;
  href: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04, duration: 0.25 }}
    >
      <Link
        href={href}
        className={cn(
          "flex items-center justify-between gap-3 rounded-md px-2 py-2",
          "transition-colors hover:bg-dark-600",
        )}
      >
        <span className="truncate text-sm text-white">{title}</span>
        {subtitle && (
          <span className="shrink-0 truncate text-xs text-light-400">
            {subtitle}
          </span>
        )}
      </Link>
    </motion.div>
  );
}
