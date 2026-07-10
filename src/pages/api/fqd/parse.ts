import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import {
  parseEventWithFallback,
  PROVIDER_META,
  FqdAllProvidersError,
} from "@/features/fqd/lib/fqd-research";

export const config = {
  api: { bodyParser: { sizeLimit: "1mb" } },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body as { text?: string };
  if (!text?.trim()) {
    return res.status(400).json({ error: "No text provided to parse" });
  }

  try {
    const { data, provider, raw } = await parseEventWithFallback(text.trim());
    const meta = PROVIDER_META[provider];
    return res.status(200).json({
      data,
      provider,
      providerLabel: meta.providerLabel,
      // No web search on the parse path — the text is supplied directly.
      searchEngine: "Text parse (no web search)",
      raw,
    });
  } catch (err) {
    if (err instanceof FqdAllProvidersError) {
      return res.status(503).json({
        error: "All AI providers failed to parse this listing.",
        attempts: err.attempts,
      });
    }
    return res.status(502).json({
      error: err instanceof Error ? err.message : "Parse failed",
    });
  }
}
