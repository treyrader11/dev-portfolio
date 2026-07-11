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
import { splitListings, chunk } from "../lib/split-listings";
import type { EventResearch, FqdDuplicateInfo } from "../types/fqd-types";

const BATCH = 5;

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
  const [duplicates, setDuplicates] = useState<(FqdDuplicateInfo | null)[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(
    null,
  );
  const [errors, setErrors] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  function close() {
    setOpen(false);
    setText("");
    setParsed(null);
    setDuplicates([]);
    setSelected(new Set());
    setProgress(null);
    setErrors([]);
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

  // Turn a failed response into a specific, human message.
  async function describeFailure(res: Response): Promise<string> {
    if (res.status === 504 || res.status === 502)
      return "the server timed out (batch too large or the AI was slow)";
    if (res.status === 401) return "not authorized — sign in again";
    try {
      const d = await res.json();
      let msg = d.error ?? `HTTP ${res.status}`;
      if (Array.isArray(d.attempts) && d.attempts.length)
        msg += ` — ${d.attempts.join("; ")}`;
      return msg;
    } catch {
      return `HTTP ${res.status}`;
    }
  }

  // Split client-side and parse in small batches (each request stays short, so
  // a big document can't time out the whole thing). Progress + per-batch errors
  // are surfaced to the user.
  async function parse() {
    if (!text.trim() || parsing) return;
    const blocks = splitListings(text);
    if (blocks.length === 0) {
      addNotification({ text: "No listings found in that text", variant: "error" });
      return;
    }

    const batches = chunk(blocks, BATCH);
    setParsing(true);
    setErrors([]);
    setProgress({ done: 0, total: blocks.length });

    const all: EventResearch[] = [];
    const batchErrors: string[] = [];

    for (let bi = 0; bi < batches.length; bi++) {
      const batch = batches[bi];
      const range = `Listings ${bi * BATCH + 1}–${bi * BATCH + batch.length}`;
      try {
        const res = await fetch("/api/fqd/bulk-parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: batch.join("\n\n") }),
        });
        if (!res.ok) {
          batchErrors.push(`${range}: ${await describeFailure(res)}`);
        } else {
          const data = await res.json();
          all.push(...((data.events as EventResearch[]) ?? []));
        }
      } catch {
        batchErrors.push(`${range}: request failed (network or connection dropped)`);
      }
      setProgress({
        done: Math.min((bi + 1) * BATCH, blocks.length),
        total: blocks.length,
      });
    }

    setParsing(false);
    setProgress(null);
    setErrors(batchErrors);

    if (all.length === 0) {
      addNotification({
        text: batchErrors[0]
          ? `Import failed — ${batchErrors[0]}`
          : "No events could be parsed from that text",
        variant: "error",
      });
      return;
    }
    // Flag which parsed events already exist so the reviewer can skip or
    // replace them instead of silently creating duplicates.
    let dups: (FqdDuplicateInfo | null)[] = all.map(() => null);
    try {
      const dupRes = await fetch("/api/fqd/events/check-duplicates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          events: all.map((e) => ({ title: e.title, startDate: e.startDate })),
        }),
      });
      if (dupRes.ok) {
        const d = await dupRes.json();
        if (Array.isArray(d.duplicates)) dups = d.duplicates;
      }
    } catch {
      /* non-fatal — treat as no duplicates */
    }

    setDuplicates(dups);
    setParsed(all);
    // Default: select the new events; leave existing ones unchecked (they'll be
    // skipped) until the user explicitly opts to replace them.
    setSelected(new Set(all.map((_, i) => i).filter((i) => !dups[i])));

    const dupCount = dups.filter(Boolean).length;
    if (batchErrors.length) {
      addNotification({
        text: `Parsed ${all.length} events, but ${batchErrors.length} batch(es) failed — see details`,
        variant: "error",
      });
    } else if (dupCount > 0) {
      addNotification({
        text: `${dupCount} of ${all.length} already exist — check them to replace`,
        variant: "success",
      });
    }
  }

  async function create() {
    if (!parsed || creating) return;
    // Selected duplicates carry a replaceId (delete-then-recreate); selected new
    // events are created as-is.
    const events = parsed
      .map((f, i) => ({ f, i }))
      .filter(({ i }) => selected.has(i))
      .map(({ f, i }) => {
        const dup = duplicates[i];
        return dup ? { ...f, replaceId: dup.id } : f;
      });
    if (!events.length) return;
    setCreating(true);
    try {
      const res = await fetch("/api/fqd/events/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events }),
      });
      if (res.ok) {
        const data = await res.json();
        const parts: string[] = [];
        if (data.created) parts.push(`created ${data.created}`);
        if (data.replaced) parts.push(`replaced ${data.replaced}`);
        if (data.skipped) parts.push(`skipped ${data.skipped}`);
        addNotification({
          text: parts.length
            ? parts.join(", ").replace(/^./, (c) => c.toUpperCase())
            : "Nothing to create",
          variant: "success",
        });
        close();
        router.replace(router.asPath); // refresh the list
      } else {
        addNotification({
          text: `Couldn't create events — ${await describeFailure(res)}`,
          variant: "error",
        });
      }
    } catch {
      addNotification({
        text: "Couldn't create events — request failed (network or timeout)",
        variant: "error",
      });
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

  // How many of the checked items are replacements vs brand-new creates.
  const selectedReplace = [...selected].filter((i) => duplicates[i]).length;

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
                {/* Specific per-batch failure details. */}
                {errors.length > 0 && (
                  <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
                    <p className="font-medium text-red-200">
                      {errors.length} batch{errors.length === 1 ? "" : "es"}{" "}
                      failed:
                    </p>
                    <ul className="mt-1 list-disc space-y-0.5 pl-4">
                      {errors.map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                  </div>
                )}

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
                    {parsed.map((f, i) => {
                      const dup = duplicates[i];
                      const on = selected.has(i);
                      return (
                        <label
                          key={i}
                          className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                            on
                              ? dup
                                ? "border-amber-500/50 bg-amber-500/5"
                                : "border-secondary/50 bg-dark-400"
                              : "border-dark-600 opacity-60",
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() => toggle(i)}
                            className={cn(
                              "mt-1 size-4 shrink-0",
                              dup ? "accent-amber-500" : "accent-secondary",
                            )}
                          />
                          <div className="min-w-0">
                            <p className="flex items-center gap-2 truncate font-medium text-white">
                              <span className="truncate">
                                {f.title || "(untitled)"}
                              </span>
                              {dup && (
                                <span className="shrink-0 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-300">
                                  {on ? "Will replace" : "Already exists"}
                                </span>
                              )}
                            </p>
                            <p className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-light-400">
                              <span>{previewDate(f)}</span>
                              {f.locationName && <span>{f.locationName}</span>}
                              {f.category && <span>{f.category}</span>}
                            </p>
                          </div>
                        </label>
                      );
                    })}
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
                    {parsing
                      ? progress
                        ? `Parsing ${progress.done}/${progress.total}…`
                        : "Parsing…"
                      : "Parse with AI"}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setParsed(null);
                        setDuplicates([]);
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
                      Save {selected.size} event
                      {selected.size === 1 ? "" : "s"}
                      {selectedReplace > 0
                        ? ` (${selectedReplace} replace)`
                        : ""}
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
