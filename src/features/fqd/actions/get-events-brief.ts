import { prisma } from "@/lib/prisma";

export interface FqdEventBrief {
  id: string;
  title: string;
  slug: string;
  startDate: string; // ISO
  imageCount: number;
}

// Lightweight list of every event (for the export-selection modal) — enough to
// identify and pick each event without loading images/details.
export async function getAllFqdEventsBrief(): Promise<FqdEventBrief[]> {
  const rows = await prisma.fqdEvent.findMany({
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
