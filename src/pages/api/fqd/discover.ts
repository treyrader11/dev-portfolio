import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  discoverEventsWithFallback,
  PROVIDER_META,
  aiErrorResponse,
} from "@/features/fqd/lib/fqd-research";
import { fuzzyTitleKey } from "@/features/fqd/lib/duplicates";
import { parseFqdProvider } from "@/features/fqd/types/fqd-types";

// Web search can take a while (multiple tool calls). 300s is the max on Vercel
// Pro (capped to the plan limit on Hobby) — a 60s cap was causing 504s.
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

  // Today (server local date, YYYY-MM-DD) — used to exclude past events.
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(now.getDate()).padStart(2, "0")}`;

  const { provider: sel } = req.body as { provider?: string };

  try {
    const { events, provider } = await discoverEventsWithFallback(
      existing,
      today,
      parseFqdProvider(sel),
    );

    // Deterministic safety nets on top of the model's own filtering:
    //  - fuzzy-dedupe: drop any discovered event whose normalized title matches
    //    an existing one (or an earlier result in this batch);
    //  - date: drop events dated before today (keep undated ones).
    const existingKeys = new Set(existing.map((e) => fuzzyTitleKey(e.title)));
    const seen = new Set<string>();
    const fresh = events.filter((e) => {
      const key = fuzzyTitleKey(e.title);
      if (!key || existingKeys.has(key) || seen.has(key)) return false;
      if (e.startDate && e.startDate.slice(0, 10) < today) return false;
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
    const { status, body } = aiErrorResponse(err, "Discovery failed");
    return res.status(status).json(body);
  }
}
