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
      let done = false;
      const settleOk = () => {
        if (!done) {
          done = true;
          resolve();
        }
      };
      const settleErr = (err: unknown) => {
        if (!done) {
          done = true;
          reject(err);
        }
      };
      stream.on("error", settleErr);
      res.on("error", settleErr);
      // Resolve only once the RESPONSE has flushed every byte to the client
      // ("finish"), not when the source stream drains ("end") — otherwise the
      // handler can return and the platform tears down mid-flush, truncating
      // the download and failing the client's blob().
      res.on("finish", settleOk);
      // A close before finish means the connection dropped mid-stream.
      res.on("close", () =>
        settleErr(new Error("connection closed before the zip finished")),
      );
      stream.pipe(res);
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
