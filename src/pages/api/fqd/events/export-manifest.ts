import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { serializeFqdEvent } from "@/features/fqd/lib/serialize";
import { buildEventListingDocx } from "@/features/fqd/lib/event-listing-docx";
import {
  generateEventCsv,
  generateCombinedCsv,
} from "@/features/fqd/lib/event-csv";
import {
  eventImageFilename,
  pngDeliveryUrl,
} from "@/features/fqd/lib/image-filenames";

// The export manifest: everything needed to assemble the zip IN THE BROWSER
// except the image bytes. The client fetches images straight from Cloudinary
// (CORS-enabled) and zips locally, so no large payload passes through the
// serverless function — which is what let big image-heavy exports blow past the
// memory/time limits when the zip was built server-side. This route only builds
// the (small) DOCX + CSV text, so it stays fast and light.
export const config = { maxDuration: 60 };

interface ManifestImage {
  filename: string;
  url: string;
}

interface ManifestEvent {
  folderName: string;
  docxBase64: string;
  csv: string;
  images: ManifestImage[];
}

export interface ExportManifest {
  events: ManifestEvent[];
  allCsv: string;
}

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

    const events = rows.map(serializeFqdEvent);
    const manifest: ManifestEvent[] = await Promise.all(
      events.map(async (event) => {
        // Slug is unique, so folder names never collide.
        const folderName = event.slug || `event-${event.id.slice(0, 8)}`;
        const docx = await buildEventListingDocx(event);
        const total = event.images.length;
        return {
          folderName,
          docxBase64: Buffer.from(docx).toString("base64"),
          csv: generateEventCsv(event),
          images: event.images.map((img, i) => ({
            filename: eventImageFilename(event.slug, i, total),
            url: pngDeliveryUrl(img.url, img.cloudinaryId),
          })),
        };
      }),
    );

    const payload: ExportManifest = {
      events: manifest,
      allCsv: generateCombinedCsv(events),
    };
    return res.status(200).json(payload);
  } catch (err) {
    console.error("[fqd export-manifest] failed", err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Export failed",
    });
  }
}
