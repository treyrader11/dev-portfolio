"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import {
  RiUploadCloud2Line,
  RiLoader4Line,
  RiSparkling2Line,
  RiCloseLine,
} from "react-icons/ri";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import { cn } from "@/lib/utils";
import type { EventResearch } from "../types/fqd-types";

function previewDate(f: EventResearch): string {
  if (!f.startDate) return "no date";
  return f.endDate && f.endDate !== f.startDate
    ? `${f.startDate} – ${f.endDate}`
    : f.startDate;
}

export function EventImport() {
  const router = useRouter();
  const { addNotification } = useNotificationsContext();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [reading, setReading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [parsed, setParsed] = useState<EventResearch[] | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);

  function close() {
    setOpen(false);
    setText("");
    setParsed(null);
    setSelected(new Set());
  }

  // Read a .docx to text via the server (mammoth) and drop it into the box.
  async function handleFile(file: File | undefined) {
    if (!file) return;
    setReading(true);
    try {
      const dataUrl: string = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      const res = await fetch("/api/fqd/extract-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileBase64: dataUrl.split(",")[1] }),
      });
      const data = await res.json();
      if (res.ok) setText(data.text ?? "");
      else
        addNotification({
          text: data.error ?? "Couldn't read that file — paste the text instead",
          variant: "error",
        });
    } catch {
      addNotification({
        text: "Couldn't read that file — paste the text instead",
        variant: "error",
      });
    } finally {
      setReading(false);
    }
  }

  async function parse() {
    if (!text.trim() || parsing) return;
    setParsing(true);
    try {
      const res = await fetch("/api/fqd/bulk-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        addNotification({ text: data.error ?? "Parse failed", variant: "error" });
        return;
      }
      const events: EventResearch[] = data.events ?? [];
      setParsed(events);
      setSelected(new Set(events.map((_, i) => i)));
      if (events.length === 0) {
        addNotification({ text: "No events found in that text", variant: "error" });
      }
    } catch {
      addNotification({ text: "Network error", variant: "error" });
    } finally {
      setParsing(false);
    }
  }

  async function create() {
    if (!parsed || creating) return;
    const events = parsed.filter((_, i) => selected.has(i));
    if (!events.length) return;
    setCreating(true);
    try {
      const res = await fetch("/api/fqd/events/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events }),
      });
      const data = await res.json();
      if (res.ok) {
        addNotification({
          text: `Created ${data.created} event${data.created === 1 ? "" : "s"}`,
          variant: "success",
        });
        close();
        router.replace(router.asPath); // refresh the list
      } else {
        addNotification({ text: data.error ?? "Create failed", variant: "error" });
      }
    } catch {
      addNotification({ text: "Network error", variant: "error" });
    } finally {
      setCreating(false);
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

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dark-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-secondary/60"
      >
        <RiUploadCloud2Line className="size-4" />
        Import
      </button>

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
              <div className="flex items-center justify-between border-b border-dark-600 px-5 py-4">
                <h3 className="text-sm font-medium text-white">
                  Import events from a document
                </h3>
                <button
                  type="button"
                  onClick={close}
                  className="text-light-400 hover:text-white"
                >
                  <RiCloseLine className="size-5" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-auto p-5">
                {!parsed ? (
                  <div className="space-y-3">
                    <p className="text-sm text-light-400">
                      Paste a document with one or more event listings, or upload
                      a .docx. AI splits it into individual events you can review
                      before creating.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        disabled={reading}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-dark-600 px-3 py-2 text-sm text-white hover:border-secondary/60 disabled:opacity-50"
                      >
                        {reading ? (
                          <RiLoader4Line className="size-4 animate-spin" />
                        ) : (
                          <RiUploadCloud2Line className="size-4" />
                        )}
                        Upload .docx
                      </button>
                      <input
                        ref={fileRef}
                        type="file"
                        accept=".docx,.txt"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files?.[0])}
                      />
                      <span className="text-xs text-light-400">
                        or paste below
                      </span>
                    </div>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Paste the event listings here…"
                      rows={12}
                      className="w-full resize-y rounded-lg border border-dark-600 bg-transparent px-3 py-2 font-mono text-xs text-white outline-none focus:border-secondary placeholder:text-light-400"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-light-400">
                        {parsed.length} event{parsed.length === 1 ? "" : "s"}{" "}
                        found · {selected.size} selected
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setSelected(
                            selected.size === parsed.length
                              ? new Set()
                              : new Set(parsed.map((_, i) => i)),
                          )
                        }
                        className="text-xs text-secondary hover:underline"
                      >
                        {selected.size === parsed.length
                          ? "Deselect all"
                          : "Select all"}
                      </button>
                    </div>
                    {parsed.map((f, i) => (
                      <label
                        key={i}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                          selected.has(i)
                            ? "border-secondary/50 bg-dark-400"
                            : "border-dark-600 opacity-60",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={selected.has(i)}
                          onChange={() => toggle(i)}
                          className="mt-1 size-4 shrink-0 accent-secondary"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">
                            {f.title || "(untitled)"}
                          </p>
                          <p className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-light-400">
                            <span>{previewDate(f)}</span>
                            {f.locationName && <span>{f.locationName}</span>}
                            {f.category && <span>{f.category}</span>}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-dark-600 px-5 py-4">
                {!parsed ? (
                  <button
                    type="button"
                    onClick={parse}
                    disabled={parsing || !text.trim()}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary/90 disabled:opacity-50"
                  >
                    {parsing ? (
                      <RiLoader4Line className="size-4 animate-spin" />
                    ) : (
                      <RiSparkling2Line className="size-4" />
                    )}
                    {parsing ? "Parsing…" : "Parse with AI"}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setParsed(null);
                        setSelected(new Set());
                      }}
                      className="px-3 py-2 text-sm text-light-400 hover:text-white"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={create}
                      disabled={creating || selected.size === 0}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success-600 disabled:opacity-50"
                    >
                      {creating ? (
                        <RiLoader4Line className="size-4 animate-spin" />
                      ) : null}
                      Create {selected.size} event
                      {selected.size === 1 ? "" : "s"}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
