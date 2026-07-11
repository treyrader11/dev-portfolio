import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RiSearchLine, RiLoader4Line, RiDeleteBinLine } from "react-icons/ri";
import AdminLayout from "@/features/admin/components/admin-layout";
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog";
import { useDebounce } from "@/hooks/useDebounce";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import { EventCard } from "./event-card";
import { EventImport } from "./event-import";
import { EventExportAll } from "./event-export-all";
import type { GetFqdEventsResult } from "../actions/get-events";
import type { FqdEventListItem } from "../types/fqd-types";

interface Props {
  data: GetFqdEventsResult;
}

const CRUMBS = [
  { label: "Dashboard", href: "/admin" },
  { label: "French Quarter Direct", href: "/admin/french-quarter-direct" },
  { label: "Events" },
];

// "Missing field" filters — each shows only events lacking that field.
const MISSING_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "All events" },
  { value: "description", label: "Without description" },
  { value: "images", label: "Without images" },
  { value: "locationName", label: "Without location" },
  { value: "address", label: "Without address" },
  { value: "startTime", label: "Without start time" },
  { value: "endDate", label: "Without end date" },
  { value: "category", label: "Without category" },
  { value: "subcategory", label: "Without subcategory" },
  { value: "admission", label: "Without admission" },
  { value: "ticketUrl", label: "Without ticket URL" },
  { value: "organizer", label: "Without organizer" },
  { value: "expectedAttendance", label: "Without expected attendance" },
  { value: "ageRequirement", label: "Without age requirement" },
  { value: "website", label: "Without website" },
  { value: "notes", label: "Without notes" },
];

export function EventsListPage({ data }: Props) {
  const { addNotification } = useNotificationsContext();
  const [events, setEvents] = useState<FqdEventListItem[]>(data.events);
  const [total, setTotal] = useState(data.total);
  const [page, setPage] = useState(data.page);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState("");
  const [missing, setMissing] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [target, setTarget] = useState<FqdEventListItem | null>(null);
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // The title/location search runs server-side (debounced) so it also finds
  // events that haven't been paginated into the list yet.
  const debouncedSearch = useDebounce(filter, 400);
  const searching = !!debouncedSearch.trim();
  const filtering = searching || !!missing;

  const visible = events;
  const hasMore = events.length < total;
  const allVisibleSelected =
    visible.length > 0 && visible.every((e) => selected.has(e.id));

  // Fetch a page of events with the current filters. `append` adds to the list
  // (load more); otherwise it replaces it (a filter/search change).
  async function fetchEvents(
    nextPage: number,
    missingFilter: string,
    searchQuery: string,
    append: boolean,
  ) {
    setLoadingMore(true);
    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        pageSize: String(data.pageSize),
      });
      if (missingFilter) params.set("missing", missingFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      const res = await fetch(`/api/fqd/events?${params.toString()}`);
      if (res.ok) {
        const result: GetFqdEventsResult = await res.json();
        setEvents((prev) => {
          if (!append) return result.events;
          const seen = new Set(prev.map((e) => e.id));
          return [...prev, ...result.events.filter((e) => !seen.has(e.id))];
        });
        setPage(result.page);
        setTotal(result.total);
      } else {
        addNotification({ text: "Couldn't load events", variant: "error" });
      }
    } catch {
      addNotification({ text: "Couldn't load events", variant: "error" });
    } finally {
      setLoadingMore(false);
    }
  }

  // Refetch page 1 whenever the search or missing filter changes (skip the very
  // first render — the initial page is already loaded from SSR).
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setSelected(new Set());
    fetchEvents(1, missing, debouncedSearch, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, missing]);

  function loadMore() {
    if (loadingMore || !hasMore) return;
    fetchEvents(page + 1, missing, debouncedSearch, true);
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  function toggleSelectAll() {
    setSelected((prev) => {
      if (allVisibleSelected) {
        const n = new Set(prev);
        visible.forEach((e) => n.delete(e.id));
        return n;
      }
      const n = new Set(prev);
      visible.forEach((e) => n.add(e.id));
      return n;
    });
  }

  function removeFromState(ids: Set<string>, removedCount: number) {
    setEvents((prev) => prev.filter((e) => !ids.has(e.id)));
    setTotal((t) => Math.max(0, t - removedCount));
    setSelected((prev) => {
      const n = new Set(prev);
      ids.forEach((id) => n.delete(id));
      return n;
    });
  }

  async function doDelete() {
    if (!target) return;
    setDeleting(true);
    const res = await fetch(`/api/fqd/events/${target.id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    if (res.ok) {
      removeFromState(new Set([target.id]), 1);
      addNotification({ text: "Event deleted", variant: "success" });
    } else {
      addNotification({ text: "Couldn't delete event", variant: "error" });
    }
    setTarget(null);
  }

  async function doBulkDelete() {
    const ids = [...selected];
    if (ids.length === 0) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/fqd/events/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (res.ok) {
        const { deleted } = await res.json();
        removeFromState(new Set(ids), deleted);
        addNotification({
          text: `Deleted ${deleted} event${deleted === 1 ? "" : "s"}`,
          variant: "success",
        });
      } else {
        addNotification({ text: "Couldn't delete events", variant: "error" });
      }
    } catch {
      addNotification({ text: "Couldn't delete events", variant: "error" });
    } finally {
      setDeleting(false);
      setBulkConfirm(false);
    }
  }

  return (
    <AdminLayout title="Events" breadcrumbs={CRUMBS}>
      <div className="max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-light-400">
            Showing {events.length} of {total} event{total === 1 ? "" : "s"}
          </p>
          <div className="flex items-center gap-2">
            <EventExportAll />
            <EventImport />
            <Link
              href="/admin/french-quarter-direct/create-event/new"
              className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
            >
              Add Event
            </Link>
          </div>
        </div>

        {/* Filters: free-text search + missing-field — both server-side, so
            they match across all events, not just the loaded ones. */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-dark-600 bg-dark-600 px-3 py-2">
            <RiSearchLine className="size-4 shrink-0 text-light-400" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search events by title or location…"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-light-400"
            />
            {loadingMore && searching && (
              <RiLoader4Line className="size-4 shrink-0 animate-spin text-light-400" />
            )}
          </div>
          <select
            value={missing}
            onChange={(e) => setMissing(e.target.value)}
            className="rounded-lg border border-dark-600 bg-dark-600 px-3 py-2 text-sm text-white [color-scheme:dark] outline-none focus:ring-1 focus:ring-secondary sm:w-56"
          >
            {MISSING_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Bulk-select toolbar. */}
        {visible.length > 0 && (
          <div className="mb-3 flex items-center justify-between gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-light-400">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={toggleSelectAll}
                className="size-4 accent-secondary"
              />
              {selected.size > 0
                ? `${selected.size} selected`
                : "Select all"}
            </label>
            {selected.size > 0 && (
              <button
                type="button"
                onClick={() => setBulkConfirm(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-error/50 px-3 py-1.5 text-sm font-medium text-error transition-colors hover:bg-error/10"
              >
                <RiDeleteBinLine className="size-4" />
                Delete selected ({selected.size})
              </button>
            )}
          </div>
        )}

        {events.length === 0 && filtering ? (
          <div className="rounded-lg border border-dashed border-dark-600 p-8 text-center text-sm text-light-400">
            {searching ? (
              <>No events match &ldquo;{debouncedSearch.trim()}&rdquo;.</>
            ) : (
              <>
                No events{" "}
                {MISSING_FILTERS.find((f) => f.value === missing)
                  ?.label.toLowerCase()
                  .replace(/^without/, "are missing") ?? "match this filter"}
                .
              </>
            )}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-lg border border-dashed border-dark-600 p-10 text-center">
            <p className="text-white">No events yet.</p>
            <p className="mt-1 text-sm text-light-400">
              Add your first event, or use AI research on the new-event form to
              pull one in.
            </p>
            <Link
              href="/admin/french-quarter-direct/create-event/new"
              className="mt-4 inline-block rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
            >
              Add Event
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                onDelete={setTarget}
                selected={selected.has(e.id)}
                onToggleSelect={toggleSelect}
              />
            ))}
          </div>
        )}

        {/* Load more paginates within the current filters. */}
        {hasMore && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 rounded-lg border border-dark-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-secondary/60 disabled:opacity-50"
            >
              {loadingMore && <RiLoader4Line className="size-4 animate-spin" />}
              {loadingMore
                ? "Loading…"
                : `Load more (${total - events.length} remaining)`}
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={target !== null}
        title="Delete event?"
        message={`This permanently deletes "${target?.title ?? "this event"}" and its images. This can't be undone.`}
        confirmLabel={deleting ? "Deleting…" : "Delete"}
        onConfirm={doDelete}
        onCancel={() => setTarget(null)}
      />

      <ConfirmDialog
        open={bulkConfirm}
        title={`Delete ${selected.size} event${selected.size === 1 ? "" : "s"}?`}
        message={`This permanently deletes ${selected.size} event${selected.size === 1 ? "" : "s"} and all their images. This can't be undone.`}
        confirmLabel={deleting ? "Deleting…" : `Delete ${selected.size}`}
        onConfirm={doBulkDelete}
        onCancel={() => setBulkConfirm(false)}
      />
    </AdminLayout>
  );
}
