import { useState, useEffect } from "react";
import AdminLayout from "@/features/admin/components/admin-layout";
import {
  RiMapPinLine,
  RiTimeLine,
  RiExternalLinkLine,
  RiBriefcaseLine,
  RiSparkling2Line,
} from "react-icons/ri";
import { cn } from "@/lib/utils";

type JobSource = "arbeitnow" | "ai";

const SOURCES: { value: JobSource; label: string; icon: typeof RiBriefcaseLine }[] = [
  { value: "arbeitnow", label: "Job Board", icon: RiBriefcaseLine },
  { value: "ai", label: "AI Web Search", icon: RiSparkling2Line },
];

interface Job {
  slug: string;
  company_name: string;
  title: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number;
}

const PRESET_SEARCHES = [
  { label: "React / React Native", search: "react,react native" },
  { label: "TypeScript", search: "typescript" },
  { label: "Next.js", search: "next.js,nextjs" },
  { label: "Node.js", search: "node.js,nodejs" },
  { label: "Full Stack", search: "full stack,fullstack" },
  { label: "Mobile Developer", search: "mobile developer,ios,android" },
];

export function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("react,react native");
  const [customSearch, setCustomSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [activePreset, setActivePreset] = useState("react,react native");
  const [source, setSource] = useState<JobSource>("arbeitnow");
  const [error, setError] = useState<string | null>(null); // red
  const [notice, setNotice] = useState<string | null>(null); // amber

  async function fetchJobs(searchQuery: string, pageNum: number, src: JobSource) {
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch(
        `/api/admin/jobs?source=${src}&search=${encodeURIComponent(searchQuery)}&page=${pageNum}`
      );
      const data = await res.json().catch(() => null);
      if (res.ok) {
        const list: Job[] = data?.jobs || [];
        setJobs(list);
        setHasNext(data?.meta?.hasNext || false);
        if (list.length === 0 && src === "ai") {
          setNotice("No jobs found via AI — try different or broader keywords.");
        }
      } else if (res.status === 429 || data?.code === "quota") {
        setJobs([]);
        setHasNext(false);
        setNotice(`AI usage limit reached — ${data?.error ?? "try again later"}`);
      } else {
        setJobs([]);
        setHasNext(false);
        setError(data?.error ?? "Couldn't load jobs");
      }
    } catch {
      setJobs([]);
      setHasNext(false);
      setError("Couldn't load jobs — network error");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchJobs(search, page, source);
  }, [search, page, source]);

  function handlePreset(preset: (typeof PRESET_SEARCHES)[number]) {
    setActivePreset(preset.search);
    setSearch(preset.search);
    setPage(1);
  }

  function handleCustomSearch() {
    if (!customSearch.trim()) return;
    setActivePreset("");
    setSearch(customSearch.trim());
    setPage(1);
  }

  function timeAgo(timestamp: number) {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  return (
    <AdminLayout title="Job Board">
      <div className="flex flex-col min-h-[calc(100vh-88px)]">
        {/* Controls */}
        <div className="space-y-4 mb-6">
          {/* Source toggle: existing job board vs AI web search */}
          <div className="flex w-fit gap-1 rounded-lg bg-dark-600 p-1">
            {SOURCES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => {
                  setSource(s.value);
                  setPage(1);
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  source === s.value
                    ? "bg-secondary text-white"
                    : "text-light-400 hover:text-white"
                )}
              >
                <s.icon className="size-3.5" />
                {s.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <input
              value={customSearch}
              onChange={(e) => setCustomSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCustomSearch()}
              placeholder="Search jobs (e.g., python, devops, golang)"
              className="flex-1 px-3 py-2 border border-dark-600 rounded-lg text-sm"
            />
            <button
              onClick={handleCustomSearch}
              disabled={loading}
              className="px-4 py-2 bg-dark-600 text-white text-sm font-medium rounded-lg hover:bg-dark-600 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>

          {/* Preset Filters */}
          <div className="flex flex-wrap gap-2">
            {PRESET_SEARCHES.map((preset) => (
              <button
                key={preset.search}
                onClick={() => handlePreset(preset)}
                className={`px-3 py-1.5 text-xs font-medium border rounded-full transition-colors ${
                  activePreset === preset.search
                    ? "bg-dark-600 text-white border-dark-600"
                    : "border-dark-600 text-white hover:bg-dark-600"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}
          {notice && <p className="text-xs text-amber-400">{notice}</p>}
          {source === "ai" && !error && !notice && (
            <p className="text-xs text-light-400">
              AI searches the web for current openings matching your keywords
              (Gemini, with Claude fallback). Results are best-effort links.
            </p>
          )}
        </div>

        {/* Job List */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-dark-600 border-t-secondary rounded-full animate-spin" />
                <span className="text-sm text-light-400">
                  {source === "ai"
                    ? "AI is searching the web for jobs…"
                    : "Finding jobs..."}
                </span>
              </div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <p className="text-sm text-light-400">No jobs found matching your search.</p>
                <p className="text-xs text-light-400 mt-1">Try a different keyword or filter.</p>
              </div>
            </div>
          ) : (
            <div className="bg-dark-400 rounded-lg border border-dark-600 divide-y divide-dark-600 overflow-hidden">
              {jobs.map((job) => (
                <a
                  key={job.slug}
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 px-5 py-4 hover:bg-dark-600 transition-colors group"
                >
                  {/* Company Initial */}
                  <div className="w-10 h-10 rounded-lg bg-dark-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {job.company_name.charAt(0).toUpperCase()}
                  </div>

                  {/* Job Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-secondary truncate">
                        {job.title}
                      </h3>
                      <RiExternalLinkLine className="w-3.5 h-3.5 text-light-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                    <p className="text-xs text-light-400 mt-0.5">{job.company_name}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-xs text-light-400">
                        <RiMapPinLine className="w-3 h-3" />
                        {job.location || "Not specified"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-light-400">
                        <RiTimeLine className="w-3 h-3" />
                        {timeAgo(job.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Tags + Remote */}
                  <div className="flex flex-wrap items-center gap-1.5 flex-shrink-0 max-w-[200px] justify-end">
                    {job.remote && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-800 rounded">
                        Remote
                      </span>
                    )}
                    {job.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[10px] font-medium bg-dark-400 text-light-400 border border-dark-600 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Footer: Pagination + Attribution */}
        <div className="mt-6 space-y-3 pb-2">
          {!loading && jobs.length > 0 && source !== "ai" && (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium border border-dark-600 rounded-lg hover:bg-dark-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-xs text-light-400">Page {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext}
                className="px-4 py-2 text-sm font-medium border border-dark-600 rounded-lg hover:bg-dark-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
          <p className="text-[10px] text-light-400 text-center uppercase tracking-wider">
            {source === "ai" ? "AI web search" : "Powered by Arbeitnow"}
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
