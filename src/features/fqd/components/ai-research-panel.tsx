import { useState, type DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiSparkling2Line,
  RiLoader4Line,
  RiArrowDownSLine,
  RiSearchLine,
  RiFileTextLine,
} from "react-icons/ri";
import { cn } from "@/lib/utils";
import { FQD_PROVIDER_DOT } from "../types/fqd-types";
import { useEventResearch, type ResearchResult } from "../hooks/use-event-research";

interface Props {
  onApply: (result: ResearchResult) => void;
  defaultOpen?: boolean;
}

type Mode = "search" | "parse";

// Collapsible AI panel at the top of the event form. Two modes that both end in
// the same "populate the form" flow:
//   search — research an event by name/query (web search)
//   parse  — extract fields from a dropped .txt file or pasted listing text
export function AiResearchPanel({ onApply, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [mode, setMode] = useState<Mode>("search");
  const [query, setQuery] = useState("");
  const [text, setText] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [lastResult, setLastResult] = useState<ResearchResult | null>(null);
  const { research, parse, loading, error, notice } = useEventResearch();

  function handleResult(result: ResearchResult | null) {
    if (!result) return;
    onApply(result);
    setLastResult(result);
  }

  async function runSearch() {
    if (!query.trim() || loading) return;
    handleResult(await research(query.trim()));
  }

  async function runParse(raw?: string) {
    const content = (raw ?? text).trim();
    if (!content || loading) return;
    handleResult(await parse(content));
  }

  async function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // .txt (and other plain-text) files parse cleanly. For .docx, paste the
      // text into the box below (binary .docx can't be read in the browser).
      const content = await file.text().catch(() => "");
      if (content) {
        setText(content);
        runParse(content);
      }
      return;
    }
    const dropped = e.dataTransfer.getData("text");
    if (dropped) {
      setText(dropped);
      runParse(dropped);
    }
  }

  return (
    <div className="rounded-lg border border-secondary/40 bg-secondary/5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-white">
          <RiSparkling2Line className="size-4 text-secondary" />
          AI research &amp; auto-fill
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
              {/* Mode tabs */}
              <div className="flex gap-1 rounded-lg bg-dark-600 p-1">
                {(
                  [
                    { id: "search", label: "Search by name", icon: RiSearchLine },
                    { id: "parse", label: "Paste / drop listing", icon: RiFileTextLine },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setMode(t.id)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      mode === t.id
                        ? "bg-secondary text-white"
                        : "text-light-400 hover:text-white",
                    )}
                  >
                    <t.icon className="size-3.5" />
                    {t.label}
                  </button>
                ))}
              </div>

              {mode === "search" ? (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && runSearch()}
                    placeholder="Event name or search query"
                    className="min-w-0 flex-1 rounded-lg border border-dark-600 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-secondary placeholder:text-light-400"
                  />
                  <button
                    type="button"
                    onClick={runSearch}
                    disabled={loading || !query.trim()}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary/90 disabled:opacity-50"
                  >
                    {loading ? (
                      <RiLoader4Line className="size-4 animate-spin" />
                    ) : (
                      <RiSearchLine className="size-4" />
                    )}
                    {loading ? "Researching…" : "Research"}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={cn(
                      "rounded-lg border border-dashed p-3 text-center text-xs transition-colors",
                      dragOver
                        ? "border-secondary bg-secondary/10 text-white"
                        : "border-dark-600 text-light-400",
                    )}
                  >
                    Drop an event listing (.txt) here, or paste the text below.
                    For .docx, paste the text.
                  </div>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste the raw event listing text…"
                    rows={5}
                    className="w-full resize-y rounded-lg border border-dark-600 bg-transparent px-3 py-2 font-mono text-xs text-white outline-none focus:border-secondary placeholder:text-light-400"
                  />
                  <button
                    type="button"
                    onClick={() => runParse()}
                    disabled={loading || !text.trim()}
                    className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary/90 disabled:opacity-50"
                  >
                    {loading ? (
                      <RiLoader4Line className="size-4 animate-spin" />
                    ) : (
                      <RiSparkling2Line className="size-4" />
                    )}
                    {loading ? "Parsing…" : "Parse listing"}
                  </button>
                </div>
              )}

              {error && <p className="text-xs text-red-400">{error}</p>}
              {notice && <p className="text-xs text-amber-400">{notice}</p>}

              {/* Success — which model answered. */}
              {lastResult && !error && !notice && (
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      FQD_PROVIDER_DOT[lastResult.provider],
                    )}
                  />
                  <span>
                    Populated via{" "}
                    <span className="font-medium">
                      {lastResult.providerLabel}
                    </span>{" "}
                    · {lastResult.searchEngine}
                  </span>
                </div>
              )}

              <p className="text-xs text-light-400">
                Results auto-fill the form below — every field stays editable.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
