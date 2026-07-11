import { prisma } from "@/lib/prisma";
import { expiredCutoff, expiredEventsWhere } from "../lib/expiry";

export interface FqdEventBrief {
  id: string;
  title: string;
  slug: string;
  startDate: string; // ISO
  imageCount: number;
}

// Lightweight list of all active events (for the export-selection modal) —
// enough to identify and pick each event without loading images/details.
export async function getAllFqdEventsBrief(): Promise<FqdEventBrief[]> {
  const active = { NOT: expiredEventsWhere(expiredCutoff()) };
  const rows = await prisma.fqdEvent.findMany({
    where: active,
    orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      startDate: true,
      _count: { select: { images: true } },
    },
  });
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    startDate: r.startDate.toISOString(),
    imageCount: r._count.images,
  }));
}
