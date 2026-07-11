import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { serializeFqdEvent } from "@/features/fqd/lib/serialize";
import { buildEventsZip } from "@/features/fqd/lib/event-zip";

export const config = { maxDuration: 60 };

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

  const rows = await prisma.fqdEvent.findMany({
    where,
    orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (rows.length === 0) {
    return res.status(404).json({ error: "No events to export" });
  }

  const zip = await buildEventsZip(rows.map(serializeFqdEvent));
  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="french-quarter-events.zip"`,
  );
  return res.send(zip);
}
