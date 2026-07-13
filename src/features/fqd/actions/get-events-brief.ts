import { prisma } from "@/lib/prisma";
import { fqdEventsListWhere, type FqdEventFilters } from "./get-events";

export interface FqdEventBrief {
  id: string;
  title: string;
  slug: string;
  startDate: string; // ISO
  imageCount: number;
}

// Lightweight list of events for the export-selection modal — enough to
// identify and pick each without loading images/details. Applies the same
// filters (and not-expired guard) as the list, so the export respects whatever
// filter/tab is active; no filters = every visible event.
export async function getAllFqdEventsBrief(
  filters: FqdEventFilters = {},
): Promise<FqdEventBrief[]> {
  const rows = await prisma.fqdEvent.findMany({
    where: fqdEventsListWhere(filters),
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
