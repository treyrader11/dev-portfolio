import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/admin-auth";

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
