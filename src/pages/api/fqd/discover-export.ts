import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { buildDiscoveredEventsDocx } from "@/features/fqd/lib/discovered-events-docx";
import {
  discoveredEventSchema,
  type DiscoveredEvent,
} from "@/features/fqd/types/fqd-types";

export const config = { api: { bodyParser: { sizeLimit: "1mb" } } };

// Export a set of discovered events as a .docx list (recent → oldest by date).
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { events } = req.body as { events?: unknown };
  if (!Array.isArray(events) || events.length === 0) {
    return res.status(400).json({ error: "No events to export" });
  }

  const valid: DiscoveredEvent[] = [];
  for (const item of events) {
    const parsed = discoveredEventSchema.safeParse(item);
    if (parsed.success && parsed.data.title.trim()) valid.push(parsed.data);
  }
  if (valid.length === 0) {
    return res.status(400).json({ error: "No valid events to export" });
  }

  try {
    const docx = await buildDiscoveredEventsDocx(valid);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="new-orleans-events.docx"`,
    );
    return res.send(docx);
  } catch (err) {
    console.error("[fqd discover-export] failed", err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Export failed",
    });
  }
}
