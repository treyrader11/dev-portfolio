import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

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

export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("react,react native");
  const [customSearch, setCustomSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [activePreset, setActivePreset] = useState("react,react native");

  async function fetchJobs(searchQuery: string, pageNum: number) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/jobs?search=${encodeURIComponent(searchQuery)}&page=${pageNum}`
      );
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
        setHasNext(data.meta?.hasNext || false);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchJobs(search, page);
  }, [search, page]);

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

  function formatDate(timestamp: number) {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <AdminLayout title="Job Board">
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="flex gap-2">
          <input
            value={customSearch}
            onChange={(e) => setCustomSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustomSearch()}
            placeholder="Search jobs (e.g., python, devops, golang)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button
            onClick={handleCustomSearch}
            disabled={loading}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50"
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
                  ? "bg-gray-900 text-white border-gray-900"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12 text-sm text-gray-500">
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-500">
            No jobs found matching your search. Try a different keyword.
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <a
                key={job.slug}
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {job.company_name}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">
                        {job.location || "Not specified"}
                      </span>
                      {job.remote && (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 rounded-full">
                          Remote
                        </span>
                      )}
                      {job.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                    {formatDate(job.created_at)}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && jobs.length > 0 && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNext}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        <p className="text-xs text-gray-400 text-center">
          Job data provided by Arbeitnow. Updated hourly.
        </p>
      </div>
    </AdminLayout>
  );
}
