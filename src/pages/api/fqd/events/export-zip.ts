import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { serializeFqdEvent } from "@/features/fqd/lib/serialize";
import { buildEventsZip } from "@/features/fqd/lib/event-zip";

// A zip of many events + images is large — opt out of Next's 4 MB API response
// cap, and allow time for image fetching.
export const config = { maxDuration: 60, api: { responseLimit: false } };

// Export events as a .zip with one folder per event (named by slug), each
// containing the formatted listing .docx and all image PNGs. Body may include
// `ids` to export a selection; omit it to export every active event.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { ids } = req.body as { ids?: string[] };
  const where =
    Array.isArray(ids) && ids.length ? { id: { in: ids } } : undefined;

  try {
    const rows = await prisma.fqdEvent.findMany({
      where,
      orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
      include: { images: { orderBy: { order: "asc" } } },
    });
    if (rows.length === 0) {
      return res.status(404).json({ error: "No events to export" });
    }

    // Assemble the zip (image fetching + docx happen here — any hard failure is
    // caught below and returned as JSON before we start streaming).
    const zip = await buildEventsZip(rows.map(serializeFqdEvent));

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="french-quarter-events.zip"`,
    );

    // Stream rather than buffer — an all-events export can be 100+ MB, which
    // can't be returned as a single response body.
    const stream = zip.generateNodeStream({
      type: "nodebuffer",
      streamFiles: true,
    });
    await new Promise<void>((resolve, reject) => {
      stream.on("error", reject);
      res.on("error", reject);
      res.on("close", resolve);
      stream.pipe(res);
      stream.on("end", resolve);
    });
  } catch (err) {
    console.error("[fqd export-zip] export failed", err);
    if (!res.headersSent) {
      return res.status(500).json({
        error: err instanceof Error ? err.message : "Export failed",
      });
    }
    res.end();
  }
}
