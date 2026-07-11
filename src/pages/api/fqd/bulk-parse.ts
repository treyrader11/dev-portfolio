import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import {
  bulkParseEvents,
  PROVIDER_META,
  FqdAllProvidersError,
} from "@/features/fqd/lib/fqd-research";

export const config = {
  // Large pasted documents — allow a bigger body.
  api: { bodyParser: { sizeLimit: "4mb" } },
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
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    const { events, provider } = await bulkParseEvents(text.trim());
    return res.status(200).json({
      events,
      provider,
      providerLabel: provider ? PROVIDER_META[provider].providerLabel : null,
    });
  } catch (err) {
    if (err instanceof FqdAllProvidersError) {
      return res.status(503).json({
        error: "All AI providers failed to parse the listings.",
        attempts: err.attempts,
      });
    }
    return res.status(502).json({
      error: err instanceof Error ? err.message : "Bulk parse failed",
    });
  }
}
