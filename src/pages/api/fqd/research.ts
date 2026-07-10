import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import {
  researchEventWithFallback,
  PROVIDER_META,
  FqdAllProvidersError,
} from "@/features/fqd/lib/fqd-research";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body as { query?: string };
  if (!query?.trim()) {
    return res.status(400).json({ error: "A search query is required" });
  }

  try {
    const { data, provider, raw } = await researchEventWithFallback(query.trim());
    const meta = PROVIDER_META[provider];
    return res.status(200).json({
      data,
      provider,
      providerLabel: meta.providerLabel,
      searchEngine: meta.searchEngine,
      raw,
    });
  } catch (err) {
    if (err instanceof FqdAllProvidersError) {
      return res.status(503).json({
        error: "All AI providers failed to research this event.",
        attempts: err.attempts,
      });
    }
    return res.status(502).json({
      error: err instanceof Error ? err.message : "Research failed",
    });
  }
}
