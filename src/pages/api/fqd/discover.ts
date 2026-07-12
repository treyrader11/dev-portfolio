import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  discoverEventsWithFallback,
  PROVIDER_META,
  FqdAllProvidersError,
} from "@/features/fqd/lib/fqd-research";
import { fuzzyTitleKey } from "@/features/fqd/lib/duplicates";

// Web search can take a while (multiple tool calls) — give it room.
export const config = { maxDuration: 60 };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rows = await prisma.fqdEvent.findMany({
    select: { title: true, startDate: true },
  });
  const existing = rows.map((r) => ({
    title: r.title,
    startDate: r.startDate.toISOString(),
  }));

  try {
    const { events, provider } = await discoverEventsWithFallback(existing);

    // Deterministic fuzzy-dedupe safety net: drop any discovered event whose
    // normalized title matches an existing one (or an earlier result), catching
    // near-duplicates the model may have missed.
    const existingKeys = new Set(existing.map((e) => fuzzyTitleKey(e.title)));
    const seen = new Set<string>();
    const fresh = events.filter((e) => {
      const key = fuzzyTitleKey(e.title);
      if (!key || existingKeys.has(key) || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const meta = PROVIDER_META[provider];
    return res.status(200).json({
      events: fresh,
      provider,
      providerLabel: meta.providerLabel,
      searchEngine: meta.searchEngine,
    });
  } catch (err) {
    if (err instanceof FqdAllProvidersError) {
      return res.status(503).json({
        error: "All AI providers failed to discover events.",
        attempts: err.attempts,
      });
    }
    return res.status(502).json({
      error: err instanceof Error ? err.message : "Discovery failed",
    });
  }
}
