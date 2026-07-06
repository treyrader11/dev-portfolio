import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiSparkling2Line,
  RiLoader4Line,
  RiArrowDownSLine,
} from "react-icons/ri";
import { cn } from "@/lib/utils";

// What the analyze endpoint returns and hands back to the form.
export interface PackageAnalysis {
  filterCategory: string;
  tags: string[];
  technologyFeatures: string[];
  packages: string[];
}

interface Props {
  // Populate the form's Filter Category, Tags, Technology Features and Packages
  // fields from the AI result. The values are a starting point — still fully
  // editable afterwards.
  onResult: (result: PackageAnalysis) => void;
}

// An optional shortcut that sits above the manual fields: paste a package.json,
// let the AI infer the Filter Category, Tags, and Technology Features (and parse
// the dependencies), then auto-populate those fields. Collapsible so it stays
// out of the way when not needed.
export function PackageAiAnalyzer({ onResult }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function analyze() {
    if (!value.trim() || loading) return;
    setLoading(true);
    setError(null);
    setDone(false);
    try {
      const res = await fetch("/api/admin/projects/analyze-package-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageJson: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong");
        return;
      }
      onResult({
        filterCategory: data.filterCategory ?? "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        technologyFeatures: Array.isArray(data.technologyFeatures)
          ? data.technologyFeatures
          : [],
        packages: Array.isArray(data.packages) ? data.packages : [],
      });
      setDone(true);
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col rounded-lg border border-secondary/40 bg-secondary/5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-white">
          <RiSparkling2Line className="size-4 text-secondary" />
          Auto-populate from package.json
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
                Paste your package.json and let AI infer the Filter Category,
                Tags, and Technology Features. Everything stays editable after.
              </p>
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Paste your full package.json here..."
                rows={6}
                spellCheck={false}
                className="w-full resize-y rounded-lg border border-dark-600 bg-transparent px-3 py-2 font-mono text-xs text-white outline-none focus:border-secondary placeholder:text-light-400"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={analyze}
                  disabled={loading || !value.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary/90 disabled:opacity-50"
                >
                  {loading ? (
                    <RiLoader4Line className="size-4 animate-spin" />
                  ) : (
                    <RiSparkling2Line className="size-4" />
                  )}
                  {loading ? "Analyzing..." : "Analyze with AI"}
                </button>
                {done && !error && (
                  <span className="text-xs text-success">
                    Fields populated — review and edit as needed.
                  </span>
                )}
                {error && <span className="text-xs text-red-400">{error}</span>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
