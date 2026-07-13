"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  RiFolderZipLine,
  RiLoader4Line,
  RiCloseLine,
  RiImageLine,
  RiMailSendLine,
} from "react-icons/ri";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import { cn } from "@/lib/utils";
import { fmtEventDate } from "../lib/format";
import { EventExportEmailStep } from "./event-export-email-step";
import type { FqdEventBrief } from "../actions/get-events-brief";

// The active list filters, so the export modal loads only the filtered set.
export interface EventExportFilters {
  missing?: string;
  search?: string;
  added?: string;
  newOnly?: string;
}

// Export events to a .zip (one folder per event slug, each with the listing
// .docx + image PNGs). Opens a modal listing every event with checkboxes —
// all selected by default, deselect individually. Honors the active list
// filters (via `filters`), so only the visible/filtered events are offered.
export function EventExportAll({ filters }: { filters?: EventExportFilters }) {
  const { addNotification } = useNotificationsContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [events, setEvents] = useState<FqdEventBrief[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"events" | "email">("events");
  const [mounted, setMounted] = useState(false);

  // Portaling to document.body needs a client-side mount (no SSR document).
  useEffect(() => setMounted(true), []);

  function close() {
    setOpen(false);
    setEvents(null);
    setSelected(new Set());
    setView("events");
  }

  async function openModal() {
    setOpen(true);
    setLoading(true);
    try {
      // Mirror the list's active filters so the modal offers the same set.
      const params = new URLSearchParams();
      if (filters?.missing) params.set("missing", filters.missing);
      if (filters?.search?.trim()) params.set("search", filters.search.trim());
      if (filters?.added) params.set("added", filters.added);
      if (filters?.newOnly === "true") params.set("new", "true");
      const qs = params.toString();
      const res = await fetch(
        `/api/fqd/events/export-list${qs ? `?${qs}` : ""}`,
      );
      const data = await res.json();
      const list: FqdEventBrief[] = res.ok ? (data.events ?? []) : [];
      setEvents(list);
      setSelected(new Set(list.map((e) => e.id))); // all selected by default
      if (!res.ok) {
        addNotification({
          text: data.error ?? "Couldn't load events",
          variant: "error",
        });
      }
    } catch {
      setEvents([]);
      addNotification({ text: "Couldn't load events", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  // ⌘E / Ctrl+E opens the export modal.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "e") {
        e.preventDefault();
        if (!open) openModal();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function toggle(id: string) {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  const allSelected = !!events && selected.size === events.length;

  async function exportZip() {
    if (exporting || selected.size === 0) return;
    setExporting(true);
    try {
      const res = await fetch("/api/fqd/events/export-zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [...selected] }),
      });
      if (!res.ok) {
        let msg = "Couldn't export events";
        try {
          msg = (await res.json()).error ?? msg;
        } catch {
          /* non-JSON error */
        }
        addNotification({ text: msg, variant: "error" });
        return;
      }
      // Stream the zip to a download.
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "french-quarter-events.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      addNotification({
        text: `Exported ${selected.size} event${selected.size === 1 ? "" : "s"}`,
        variant: "success",
      });
      close();
    } catch {
      // A dropped connection is usually a large export exceeding the request
      // time limit — the email path builds it server-side without that cap.
      addNotification({
        text:
          selected.size > 15
            ? "Export failed — that's a lot of events for one download. Try selecting fewer, or use Share via email."
            : "Couldn't export events — the request was interrupted. Please try again.",
        variant: "error",
      });
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dark-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-secondary/60"
      >
        <RiFolderZipLine className="size-4" />
        Export
      </button>

      {/* Portaled to <body> so the fixed overlay is centered on the viewport,
          not on a transformed header/toolbar ancestor (which would offset it). */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={close}
            />
            <motion.div
              initial={{ scale: 0.96, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-dark-600 bg-dark-500"
            >
              {view === "email" ? (
                <EventExportEmailStep
                  ids={[...selected]}
                  onBack={() => setView("events")}
                  onClose={close}
                />
              ) : (
                <>
              <div className="flex items-center justify-between border-b border-dark-600 px-5 py-4">
                <div>
                  <h3 className="text-sm font-medium text-white">
                    Export events to .zip
                  </h3>
                  <p className="mt-0.5 text-xs text-light-400">
                    One folder per event (named by slug) with its listing .docx,
                    a JEvents-compatible CSV for Joomla, and image PNGs — plus a
                    combined _all-events.csv at the root.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="text-light-400 hover:text-white"
                >
                  <RiCloseLine className="size-5" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-auto p-5">
                {loading ? (
                  <div className="flex items-center justify-center gap-2 py-10 text-sm text-light-400">
                    <RiLoader4Line className="size-4 animate-spin" />
                    Loading events…
                  </div>
                ) : !events || events.length === 0 ? (
                  <p className="py-10 text-center text-sm text-light-400">
                    No events to export.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-light-400">
                        {selected.size} of {events.length} selected
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setSelected(
                            allSelected
                              ? new Set()
                              : new Set(events.map((e) => e.id)),
                          )
                        }
                        className="text-xs text-secondary hover:underline"
                      >
                        {allSelected ? "Deselect all" : "Select all"}
                      </button>
                    </div>
                    {events.map((e) => (
                      <label
                        key={e.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                          selected.has(e.id)
                            ? "border-secondary/50 bg-dark-400"
                            : "border-dark-600 opacity-60",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={selected.has(e.id)}
                          onChange={() => toggle(e.id)}
                          className="size-4 shrink-0 accent-secondary"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-white">
                            {e.title}
                          </p>
                          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-light-400">
                            <span>{fmtEventDate(e.startDate)}</span>
                            <span className="inline-flex items-center gap-1">
                              <RiImageLine className="size-3.5" />
                              {e.imageCount} image
                              {e.imageCount === 1 ? "" : "s"}
                            </span>
                            <span className="truncate font-mono">{e.slug}</span>
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-dark-600 px-5 py-4">
                <button
                  type="button"
                  onClick={close}
                  className="mr-auto px-3 py-2 text-sm text-light-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setView("email")}
                  disabled={selected.size === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-dark-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-secondary/60 disabled:opacity-50"
                >
                  <RiMailSendLine className="size-4" />
                  Share via email
                </button>
                <button
                  type="button"
                  onClick={exportZip}
                  disabled={exporting || selected.size === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary/90 disabled:opacity-50"
                >
                  {exporting ? (
                    <RiLoader4Line className="size-4 animate-spin" />
                  ) : (
                    <RiFolderZipLine className="size-4" />
                  )}
                  {exporting
                    ? "Building zip…"
                    : `Export ${selected.size} event${selected.size === 1 ? "" : "s"}`}
                </button>
              </div>
                </>
              )}
            </motion.div>
          </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
