import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import {
  researchEventWithFallback,
  PROVIDER_META,
  FqdAllProvidersError,
  isQuotaError,
} from "@/features/fqd/lib/fqd-research";
import { parseFqdProvider } from "@/features/fqd/types/fqd-types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query, provider: sel, title } = req.body as {
    query?: string;
    provider?: string;
    title?: string;
  };
  if (!query?.trim()) {
    return res.status(400).json({ error: "A search query is required" });
  }

  try {
    const { data, provider, raw, cached } = await researchEventWithFallback(
      query.trim(),
      parseFqdProvider(sel),
      typeof title === "string" ? title : undefined,
    );
    const meta = PROVIDER_META[provider];
    return res.status(200).json({
      data,
      provider,
      providerLabel: meta.providerLabel,
      searchEngine: cached ? "7-day cache" : meta.searchEngine,
      raw,
      cached: cached ?? false,
    });
  } catch (err) {
    if (err instanceof FqdAllProvidersError) {
      const quota = isQuotaError(err.attempts);
      return res.status(quota ? 429 : 502).json({
        code: quota ? "quota" : "failed",
        error: err.attempts.join(" · ") || "Research failed",
        attempts: err.attempts,
      });
    }
    return res.status(500).json({
      code: "failed",
      error: err instanceof Error ? err.message : "Research failed",
    });
  }
}
