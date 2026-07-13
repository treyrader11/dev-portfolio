import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { slugify } from "@/lib/utils";
import {
  researchJobsWithFallback,
  JobsResearchError,
  isQuotaError,
} from "@/features/jobs/lib/jobs-research";

// Web search (AI source) can take a while — give it room.
export const config = { maxDuration: 60 };

interface ArbeitnowJob {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number;
}

// AI results are mapped to the same shape the Arbeitnow path returns so the UI
// renders both identically.
async function handleAiSearch(
  res: NextApiResponse,
  search: string,
): Promise<void> {
  try {
    const { jobs, provider } = await researchJobsWithFallback(search);
    const nowSeconds = Math.floor(Date.now() / 1000);
    const mapped: ArbeitnowJob[] = jobs.map((j, i) => ({
      slug: `ai-${i}-${slugify(`${j.title}-${j.company}`) || i}`,
      company_name: j.company,
      title: j.title,
      description: "",
      remote: j.remote ?? false,
      url:
        j.url && /^https?:\/\//i.test(j.url)
          ? j.url
          : `https://www.google.com/search?q=${encodeURIComponent(`${j.title} ${j.company} job`)}`,
      tags: j.tags ?? [],
      job_types: j.jobType ? [j.jobType] : [],
      location: j.location ?? "",
      created_at: nowSeconds,
    }));
    res.json({
      jobs: mapped,
      meta: {
        page: 1,
        hasNext: false,
        total: mapped.length,
        source: "ai",
        provider,
      },
    });
  } catch (err) {
    if (err instanceof JobsResearchError) {
      const quota = isQuotaError(err.attempts);
      res.status(quota ? 429 : 502).json({
        code: quota ? "quota" : "failed",
        error: err.attempts.join(" · ") || "AI job search failed",
      });
      return;
    }
    res.status(500).json({
      code: "failed",
      error: err instanceof Error ? err.message : "AI job search failed",
    });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!(await requireAdmin(req, res))) return;

  const search = (req.query.search as string) || "react";
  const page = (req.query.page as string) || "1";
  const source = (req.query.source as string) || "arbeitnow";

  // AI web-search option (same engine as French Quarter Direct). The existing
  // Arbeitnow job board is unchanged and remains the default.
  if (source === "ai") {
    return handleAiSearch(res, search);
  }

  try {
    // Fetch from Arbeitnow API
    const response = await fetch(
      `https://www.arbeitnow.com/api/job-board-api?search=${encodeURIComponent(search)}&page=${page}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch jobs" });
    }

    const data = await response.json();
    const jobs: ArbeitnowJob[] = data.data || [];

    // Filter to only include jobs that mention react/react native in title or tags
    const keywords = search.toLowerCase().split(",").map((k) => k.trim());
    const filtered = jobs.filter((job) => {
      const titleLower = job.title.toLowerCase();
      const tagsLower = job.tags.map((t) => t.toLowerCase());
      return keywords.some(
        (kw) =>
          titleLower.includes(kw) ||
          tagsLower.some((tag) => tag.includes(kw))
      );
    });

    return res.json({
      jobs: filtered,
      meta: {
        page: Number(page),
        hasNext: !!data.links?.next,
        total: filtered.length,
        unfilteredTotal: jobs.length,
      },
    });
  } catch (e) {
    return res.status(500).json({ error: `Failed to fetch jobs: ${(e as Error).message}` });
  }
}
