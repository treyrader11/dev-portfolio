import { useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiRadarLine,
  RiLoader4Line,
  RiArrowDownSLine,
  RiSparkling2Line,
  RiCalendarLine,
  RiMapPin2Line,
  RiFileTextLine,
} from "react-icons/ri";
import { cn } from "@/lib/utils";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import { eventDateRange } from "../lib/format";
import {
  FQD_PROVIDER_DOT,
  type DiscoveredEvent,
  type EventResearch,
  type FqdProvider,
} from "../types/fqd-types";

const NULL_RESEARCH: EventResearch = {
  title: null,
  startDate: null,
  endDate: null,
  startTime: null,
  locationName: null,
  address: null,
  description: null,
  admission: null,
  website: null,
  category: null,
  subcategory: null,
  ticketUrl: null,
  organizer: null,
  expectedAttendance: null,
  ageRequirement: null,
  notes: null,
};

function discoveredToResearch(d: DiscoveredEvent): EventResearch {
  return {
    ...NULL_RESEARCH,
    title: d.title,
    startDate: d.startDate,
    endDate: d.endDate,
    locationName: d.locationName,
    category: d.category,
    description: d.description,
  };
}

// Run tasks with a small concurrency cap so per-event web-search calls don't all
// fire at once (rate limits) but the batch still finishes reasonably fast.
async function mapPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  );
  return results;
}

interface ProviderInfo {
  provider: FqdProvider;
  providerLabel: string;
  searchEngine: string;
}

// A panel (create page only) that web-searches for upcoming New Orleans events
// not already in the app, dedupes them, and lets the admin bulk-add the results
// with per-event AI web research auto-filling the fields.
export function EventDiscoverPanel() {
  const router = useRouter();
  const { addNotification } = useNotificationsContext();
  const [open, setOpen] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const [results, setResults] = useState<DiscoveredEvent[] | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [provider, setProvider] = useState<ProviderInfo | null>(null);
  const [adding, setAdding] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  async function discover() {
    if (discovering || adding) return;
    setDiscovering(true);
    setError(null);
    setResults(null);
    setProvider(null);
    try {
      const res = await fetch("/api/fqd/discover", { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Discovery failed");
        return;
      }
      const events = (data.events as DiscoveredEvent[]) ?? [];
      setResults(events);
      setSelected(new Set(events.map((_, i) => i)));
      setProvider({
        provider: data.provider,
        providerLabel: data.providerLabel,
        searchEngine: data.searchEngine,
      });
      if (events.length === 0) {
        addNotification({
          text: "No new events found — everything already exists",
          variant: "success",
        });
      }
    } catch {
      setError("Request failed (network or timeout)");
    } finally {
      setDiscovering(false);
    }
  }

  // Full AI web research for one discovered event, merged over its discovered
  // fields so a failed/empty research still yields a creatable event.
  async function researchOne(d: DiscoveredEvent): Promise<EventResearch> {
    const base = discoveredToResearch(d);
    const query =
      [d.title, d.startDate, d.locationName].filter(Boolean).join(", ") +
      ", New Orleans";
    try {
      const res = await fetch("/api/fqd/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) return base;
      const json = await res.json();
      const data = json.data as EventResearch;
      const merged: EventResearch = { ...base };
      (Object.keys(data) as (keyof EventResearch)[]).forEach((k) => {
        const v = data[k];
        if (v != null && String(v).trim() !== "") merged[k] = v;
      });
      if (!merged.title) merged.title = d.title;
      if (!merged.startDate) merged.startDate = d.startDate;
      return merged;
    } catch {
      return base;
    }
  }

  async function addSelected() {
    if (!results || adding) return;
    const items = results.filter((_, i) => selected.has(i));
    if (items.length === 0) return;

    setAdding(true);
    setError(null);
    let done = 0;
    setProgress({ done: 0, total: items.length });

    const researched = await mapPool(items, 3, async (d) => {
      const r = await researchOne(d);
      done += 1;
      setProgress({ done, total: items.length });
      return r;
    });

    try {
      const res = await fetch("/api/fqd/events/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: researched }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        const parts: string[] = [];
        if (data?.created) parts.push(`created ${data.created}`);
        if (data?.skipped) parts.push(`skipped ${data.skipped}`);
        addNotification({
          text: parts.length
            ? parts.join(", ").replace(/^./, (c) => c.toUpperCase())
            : "Nothing added",
          variant: "success",
        });
        router.push("/admin/french-quarter-direct/events");
      } else {
        setError(data?.error ?? "Couldn't add events");
      }
    } catch {
      setError("Couldn't add events (network or timeout)");
    } finally {
      setAdding(false);
      setProgress(null);
    }
  }

  // Export the selected discovered events as a .docx list (no research/create).
  async function exportDocx() {
    if (!results || exporting) return;
    const items = results.filter((_, i) => selected.has(i));
    if (items.length === 0) return;
    setExporting(true);
    setError(null);
    try {
      const res = await fetch("/api/fqd/discover-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: items }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Couldn't export events");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "new-orleans-events.docx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("Couldn't export events (network or timeout)");
    } finally {
      setExporting(false);
    }
  }

  function toggle(i: number) {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  }

  const allSelected = !!results && selected.size === results.length;
  const busy = discovering || adding;

  return (
    <div className="mb-4 rounded-lg border border-secondary/40 bg-secondary/5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-white">
          <RiRadarLine className="size-4 text-secondary" />
          Discover New Orleans events
        </span>
        <RiArrowDownSLine
          className={cn(
            "size-4 text-light-400 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 px-4 pb-4">
              <p className="text-xs text-light-400">
                AI searches the web for upcoming New Orleans events that
                aren&apos;t already in your app. Add any of the results and their
                fields auto-fill from a web search.
              </p>

              <button
                type="button"
                onClick={discover}
                disabled={busy}
                className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary/90 disabled:opacity-50"
              >
                {discovering ? (
                  <RiLoader4Line className="size-4 animate-spin" />
                ) : (
                  <RiRadarLine className="size-4" />
                )}
                {discovering
                  ? "Searching the web…"
                  : results
                    ? "Search again"
                    : "Find new events"}
              </button>

              {error && <p className="text-xs text-red-400">{error}</p>}

              {provider && results && results.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-light-300">
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      FQD_PROVIDER_DOT[provider.provider],
                    )}
                  />
                  <span>
                    Discovered via{" "}
                    <span className="font-medium text-white">
                      {provider.providerLabel}
                    </span>{" "}
                    · {provider.searchEngine}
                  </span>
                </div>
              )}

              {results && results.length > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        setSelected(
                          allSelected
                            ? new Set()
                            : new Set(results.map((_, i) => i)),
                        )
                      }
                      className="text-xs font-medium text-secondary hover:underline"
                    >
                      {allSelected ? "Deselect all" : "Select all"}
                    </button>
                    <span className="text-xs text-light-400">
                      {selected.size} of {results.length} selected
                    </span>
                  </div>

                  <div className="max-h-80 space-y-2 overflow-auto">
                    {results.map((e, i) => (
                      <label
                        key={`${e.title}-${i}`}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                          selected.has(i)
                            ? "border-secondary/60 bg-secondary/10"
                            : "border-dark-600 hover:border-secondary/40",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={selected.has(i)}
                          onChange={() => toggle(i)}
                          className="mt-0.5 size-4 shrink-0 accent-secondary"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-white">{e.title}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-light-400">
                            {e.startDate && (
                              <span className="inline-flex items-center gap-1">
                                <RiCalendarLine className="size-3.5" />
                                {eventDateRange(e.startDate, e.endDate ?? null)}
                              </span>
                            )}
                            {e.locationName && (
                              <span className="inline-flex items-center gap-1">
                                <RiMapPin2Line className="size-3.5" />
                                {e.locationName}
                              </span>
                            )}
                            {e.category && <span>{e.category}</span>}
                          </div>
                          {e.description && (
                            <p className="mt-1 line-clamp-2 text-xs text-light-300">
                              {e.description}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={addSelected}
                      disabled={adding || exporting || selected.size === 0}
                      className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-success px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-success-600 disabled:opacity-50"
                    >
                      {adding ? (
                        <RiLoader4Line className="size-4 animate-spin" />
                      ) : (
                        <RiSparkling2Line className="size-4" />
                      )}
                      {adding && progress
                        ? `Researching ${progress.done}/${progress.total}…`
                        : `Add ${selected.size} & auto-fill`}
                    </button>
                    <button
                      type="button"
                      onClick={exportDocx}
                      disabled={exporting || adding || selected.size === 0}
                      title="Export the selected events as a .docx list"
                      className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-dark-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-secondary/60 disabled:opacity-50"
                    >
                      {exporting ? (
                        <RiLoader4Line className="size-4 animate-spin" />
                      ) : (
                        <RiFileTextLine className="size-4" />
                      )}
                      {exporting
                        ? "Exporting…"
                        : `Export ${selected.size} (.docx)`}
                    </button>
                  </div>
                </>
              )}

              {results && results.length === 0 && !discovering && (
                <p className="text-xs text-light-400">
                  No new events found — everything the search surfaced already
                  exists in your app.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
