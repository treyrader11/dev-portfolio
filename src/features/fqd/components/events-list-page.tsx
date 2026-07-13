import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  RiSearchLine,
  RiLoader4Line,
  RiCloseLine,
  RiArrowDownSLine,
  RiCheckLine,
  RiFilter3Line,
  RiAddLine,
  RiListUnordered,
  RiLayoutGridLine,
} from "react-icons/ri";
import AdminLayout from "@/features/admin/components/admin-layout";
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog";
import { Popover } from "@/components/ui/popover";
import { useDebounce } from "@/hooks/useDebounce";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import { cn } from "@/lib/utils";
import {
  EventCardMobile,
  EventCardMobileSkeleton,
} from "./event-card-mobile";
import {
  EventListItem,
  EventListItemSkeleton,
} from "./event-list-item";
import { EventImport } from "./event-import";
import { EventExportAll } from "./event-export-all";
import { EventBulkActionsBar } from "./event-bulk-actions-bar";
import { EventsScrollTop } from "./events-scroll-top";
import {
  readEventsListSnapshot,
  writeEventsListSnapshot,
  clearEventsListSnapshot,
} from "../lib/events-list-snapshot";
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
  { value: "incomplete", label: "Incomplete (any missing field)" },
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

// "Added to French Quarter Direct" pill filter.
const ADDED_PILLS: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: "true", label: "Added" },
  { value: "false", label: "Not added" },
];

export function EventsListPage({ data }: Props) {
  const { addNotification } = useNotificationsContext();
  const router = useRouter();
  const [events, setEvents] = useState<FqdEventListItem[]>(data.events);
  const [total, setTotal] = useState(data.total);
  const [page, setPage] = useState(data.page);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [filter, setFilter] = useState("");
  const [missing, setMissing] = useState("");
  const [added, setAdded] = useState("");
  const [newOnly, setNewOnly] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [target, setTarget] = useState<FqdEventListItem | null>(null);
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // The title/location search runs server-side (debounced) so it also finds
  // events that haven't been paginated into the list yet.
  const debouncedSearch = useDebounce(filter, 400);
  const searching = !!debouncedSearch.trim();
  const filtering = searching || !!missing || !!added || newOnly === "true";

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
    addedFilter: string,
    newFilter: string,
    append: boolean,
  ) {
    if (append) setLoadingMore(true);
    else setReloading(true);
    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        pageSize: String(data.pageSize),
      });
      if (missingFilter) params.set("missing", missingFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (addedFilter) params.set("added", addedFilter);
      if (newFilter === "true") params.set("new", "true");
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
      if (append) setLoadingMore(false);
      else setReloading(false);
    }
  }

  // Keep the latest list state in a ref so the navigation handler can snapshot
  // it without re-subscribing on every change.
  const stateRef = useRef({
    events,
    total,
    page,
    filter,
    missing,
    added,
    newOnly,
  });
  stateRef.current = { events, total, page, filter, missing, added, newOnly };

  // Save a snapshot (loaded events + filters + scroll) before navigating away,
  // so returning via "View events" resumes right where you were.
  useEffect(() => {
    const save = () =>
      writeEventsListSnapshot({
        ...stateRef.current,
        scrollY: window.scrollY,
      });
    router.events.on("routeChangeStart", save);
    return () => router.events.off("routeChangeStart", save);
  }, [router.events]);

  // On mount, restore a snapshot if one exists (one-shot), then scroll back to
  // where the user was. Suppresses the filter-refetch while restoring.
  const isRestoring = useRef(false);
  useEffect(() => {
    const snap = readEventsListSnapshot();
    clearEventsListSnapshot();
    if (!snap || !Array.isArray(snap.events) || snap.events.length === 0) return;

    isRestoring.current = true;
    setEvents(snap.events);
    setTotal(snap.total);
    setPage(snap.page);
    setFilter(snap.filter);
    setMissing(snap.missing);
    setAdded(snap.added);
    setNewOnly(snap.newOnly ?? "");
    // Clear the guard after the debounced filter effect would have settled.
    const clear = setTimeout(() => {
      isRestoring.current = false;
    }, 700);
    // Restore scroll once the list has painted (cards are fixed-height, so the
    // page height is stable regardless of image loading).
    const y = snap.scrollY || 0;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => window.scrollTo(0, y)),
    );
    return () => clearTimeout(clear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch page 1 whenever a filter/search changes (skip the very first render
  // — the initial page is already loaded from SSR — and while restoring).
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (isRestoring.current) return;
    setSelected(new Set());
    fetchEvents(1, missing, debouncedSearch, added, newOnly, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, missing, added, newOnly]);

  function loadMore() {
    if (loadingMore || !hasMore) return;
    fetchEvents(page + 1, missing, debouncedSearch, added, newOnly, true);
  }

  // On touch devices, dragging to scroll the list dismisses the keyboard (blurs
  // the search). With the keyboard closed, the sticky header/toolbar behave
  // normally — iOS otherwise keeps the focused input's container visible and
  // renders content over the header while scrolling. No-op on desktop (no
  // touchmove).
  useEffect(() => {
    const onTouchMove = () => {
      const input = searchInputRef.current;
      if (input && document.activeElement === input) input.blur();
    };
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => window.removeEventListener("touchmove", onTouchMove);
  }, []);

  // Toggle an event's "added to Joomla" flag.
  async function toggleAdded(event: FqdEventListItem) {
    const next = !event.addedToJoomla;
    try {
      const res = await fetch(`/api/fqd/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addedToJoomla: next }),
      });
      if (!res.ok) {
        addNotification({ text: "Couldn't update event", variant: "error" });
        return;
      }
      const updated = (await res.json()) as FqdEventListItem;
      // If the active filter no longer matches, drop it from the list.
      const dropsOut =
        (added === "true" && !updated.addedToJoomla) ||
        (added === "false" && updated.addedToJoomla);
      if (dropsOut) {
        setEvents((prev) => prev.filter((e) => e.id !== event.id));
        setTotal((t) => Math.max(0, t - 1));
      } else {
        setEvents((prev) => prev.map((e) => (e.id === event.id ? updated : e)));
      }
      addNotification({
        text: next ? "Marked as added" : "Marked as not added",
        variant: "success",
      });
    } catch {
      addNotification({ text: "Couldn't update event", variant: "error" });
    }
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

  // Bulk mark the selected events as added / not added to French Quarter Direct.
  async function doBulkSetAdded(addedValue: boolean) {
    const ids = [...selected];
    if (ids.length === 0) return;
    setBulkBusy(true);
    try {
      const res = await fetch("/api/fqd/events/bulk-added", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, added: addedValue }),
      });
      if (!res.ok) {
        addNotification({ text: "Couldn't update events", variant: "error" });
        return;
      }
      const { updated } = await res.json();
      const idSet = new Set(ids);
      // If the "Added"/"Not added" filter is active and the new value no longer
      // matches, drop the affected events from the list; otherwise update them.
      const dropsOut =
        (added === "true" && !addedValue) || (added === "false" && addedValue);
      if (dropsOut) {
        setEvents((prev) => prev.filter((e) => !idSet.has(e.id)));
        setTotal((t) => Math.max(0, t - ids.length));
      } else {
        setEvents((prev) =>
          prev.map((e) =>
            idSet.has(e.id) ? { ...e, addedToJoomla: addedValue } : e,
          ),
        );
      }
      setSelected(new Set());
      addNotification({
        text: `${addedValue ? "Added" : "Removed"} ${updated} event${
          updated === 1 ? "" : "s"
        } ${addedValue ? "to" : "from"} French Quarter Direct`,
        variant: "success",
      });
    } catch {
      addNotification({ text: "Couldn't update events", variant: "error" });
    } finally {
      setBulkBusy(false);
    }
  }

  // Compose the empty-state message from the active filters so combinations
  // (e.g. New + Added) read naturally.
  function emptyMessage(): string {
    if (searching) return `No events match “${debouncedSearch.trim()}”.`;
    const isNew = newOnly === "true";
    const noun = isNew ? "new events" : "events";
    if (added === "true") {
      return `No ${noun} have been added to French Quarter Direct yet.`;
    }
    if (added === "false") {
      return isNew
        ? "No new events are yet to be added to French Quarter Direct."
        : "All events have been added to French Quarter Direct.";
    }
    if (missing === "incomplete") {
      return isNew
        ? "Every new event has all its fields filled. 🎉"
        : "Every event has all its fields filled. 🎉";
    }
    if (missing) {
      const label =
        MISSING_FILTERS.find((f) => f.value === missing)
          ?.label.toLowerCase()
          .replace(/^without/, "are missing") ?? "match this filter";
      return `No ${noun} ${label}.`;
    }
    if (isNew) return "No new events were created today.";
    return "No events match this filter.";
  }

  return (
    <AdminLayout
      title="Events"
      hideHeaderTitle
      breadcrumbs={CRUMBS}
      headerActions={
        <>
          <EventExportAll />
          <EventImport />
          <Link
            href="/admin/french-quarter-direct/create-event/new"
            aria-label="Add event"
            className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
          >
            <RiAddLine className="size-4" />
            <span className="hidden sm:inline">Add Event</span>
          </Link>
        </>
      }
    >
      <div className="max-w-4xl">
        {/* Sticky list toolbar — sticks just below the header on scroll, with a
            translucent blur so cards show through faintly while scrolling. */}
        <div className="sticky top-20 z-20 transform-gpu border-b border-dark-600 bg-dark/80 py-3 backdrop-blur-md">
          {/* Row A: search (left, fills) + filter dropdown. */}
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-dark-600 bg-dark-600 px-3 py-2">
              <RiSearchLine className="size-4 shrink-0 text-light-400" />
              <input
                ref={searchInputRef}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search events by title or location…"
                // text-base (16px) on mobile stops iOS Safari from zooming the
                // page on focus (which broke the width + sticky header).
                className="w-full bg-transparent text-base text-white outline-none placeholder:text-light-400 sm:text-sm"
              />
              {reloading && searching && (
                <RiLoader4Line className="size-4 shrink-0 animate-spin text-light-400" />
              )}
              {filter && (
                <button
                  type="button"
                  onClick={() => setFilter("")}
                  aria-label="Clear search"
                  title="Clear search"
                  className="shrink-0 text-light-400 transition-colors hover:text-white"
                >
                  <RiCloseLine className="size-4" />
                </button>
              )}
            </div>
            {/* View toggle — grid ⇄ list. */}
            <button
              type="button"
              onClick={() => setView((v) => (v === "grid" ? "list" : "grid"))}
              aria-label={view === "grid" ? "List view" : "Grid view"}
              title={view === "grid" ? "List view" : "Grid view"}
              className="flex shrink-0 items-center rounded-lg border border-dark-600 bg-dark-600 px-3 py-2 text-light-400 transition-colors hover:border-secondary/60 hover:text-white"
            >
              {view === "grid" ? (
                <RiListUnordered className="size-4" />
              ) : (
                <RiLayoutGridLine className="size-4" />
              )}
            </button>
            <Popover
              align="end"
              rootClassName="shrink-0"
              trigger={({ open, toggle }) => (
                <button
                  type="button"
                  onClick={toggle}
                  aria-label="Filter events"
                  className={cn(
                    "flex items-center gap-2 rounded-lg border bg-dark-600 px-3 py-2 text-sm text-white transition-colors",
                    missing ? "border-secondary/60" : "border-dark-600",
                  )}
                >
                  <RiFilter3Line className="size-4 shrink-0 text-light-400" />
                  <span className="hidden truncate sm:inline">
                    {MISSING_FILTERS.find((f) => f.value === missing)?.label ??
                      "All events"}
                  </span>
                  <RiArrowDownSLine
                    className={cn(
                      "hidden size-4 shrink-0 text-light-400 transition-transform sm:inline",
                      open && "rotate-180",
                    )}
                  />
                </button>
              )}
            >
              {(close) => (
                <div className="max-h-72 overflow-auto">
                  {MISSING_FILTERS.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => {
                        setMissing(f.value);
                        close();
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                        missing === f.value
                          ? "bg-secondary/20 text-white"
                          : "text-light-400 hover:bg-dark-600 hover:text-white",
                      )}
                    >
                      <RiCheckLine
                        className={cn(
                          "size-4 shrink-0",
                          missing === f.value ? "text-secondary" : "opacity-0",
                        )}
                      />
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </Popover>
          </div>

          {/* Row B: count + pills (left) · delete + select all (far right). */}
          <div className="mt-3 flex flex-nowrap items-center gap-2 sm:flex-wrap sm:gap-3">
            <p className="shrink-0 text-xs text-light-400 sm:text-sm">
              Showing {events.length} of {total} event{total === 1 ? "" : "s"}
            </p>

            <div className="flex min-w-0 flex-1 flex-nowrap gap-1.5 overflow-x-auto sm:flex-none sm:flex-wrap sm:gap-2 [&::-webkit-scrollbar]:hidden">
              {ADDED_PILLS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setAdded(p.value)}
                  className={cn(
                    "shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium transition-colors sm:px-3 sm:py-1 sm:text-sm",
                    added === p.value
                      ? "border-secondary bg-secondary/20 text-white"
                      : "border-dark-600 text-light-400 hover:border-secondary/60 hover:text-white",
                  )}
                >
                  {p.label}
                </button>
              ))}
              {/* "New" = created today. Toggles on/off. */}
              <button
                type="button"
                onClick={() =>
                  setNewOnly((v) => (v === "true" ? "" : "true"))
                }
                aria-pressed={newOnly === "true"}
                className={cn(
                  "shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium transition-colors sm:px-3 sm:py-1 sm:text-sm",
                  newOnly === "true"
                    ? "border-success bg-success/20 text-success"
                    : "border-dark-600 text-light-400 hover:border-success/60 hover:text-white",
                )}
              >
                New
              </button>
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-3">
              {visible.length > 0 && (
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-light-400">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleSelectAll}
                    className="size-4 accent-secondary"
                  />
                  <span className="hidden sm:inline">
                    {selected.size > 0
                      ? `${selected.size} selected`
                      : "Select all"}
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4" />

        {reloading ? (
          view === "list" ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <EventListItemSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <EventCardMobileSkeleton key={i} />
              ))}
            </div>
          )
        ) : events.length === 0 && filtering ? (
          <div className="rounded-lg border border-dashed border-dark-600 p-8 text-center text-sm text-light-400">
            {emptyMessage()}
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
        ) : view === "list" ? (
          <div className="space-y-3">
            {visible.map((e) => (
              <EventListItem
                key={e.id}
                event={e}
                onDelete={setTarget}
                selected={selected.has(e.id)}
                onToggleSelect={toggleSelect}
                onToggleAdded={toggleAdded}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((e) => (
              <EventCardMobile
                key={e.id}
                event={e}
                onDelete={setTarget}
                selected={selected.has(e.id)}
                onToggleSelect={toggleSelect}
                onToggleAdded={toggleAdded}
              />
            ))}
          </div>
        )}

        {/* Skeletons appended while loading the next page. */}
        {loadingMore &&
          (view === "list" ? (
            <div className="mt-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <EventListItemSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <EventCardMobileSkeleton key={i} />
              ))}
            </div>
          ))}

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

      <EventsScrollTop />

      <EventBulkActionsBar
        count={selected.size}
        busy={bulkBusy}
        onAdd={() => doBulkSetAdded(true)}
        onRemove={() => doBulkSetAdded(false)}
        onDelete={() => setBulkConfirm(true)}
        onClear={() => setSelected(new Set())}
      />

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
