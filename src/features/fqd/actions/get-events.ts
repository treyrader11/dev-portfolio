import { prisma } from "@/lib/prisma";
import { serializeFqdEvent } from "../lib/serialize";
import type { FqdEventListItem } from "../types/fqd-types";

export interface GetFqdEventsResult {
  events: FqdEventListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Total number of events in the database. The admin manages every event it
// holds — past events are removed by the expiry cron, not hidden here.
export async function getFqdEventCount(): Promise<number> {
  return prisma.fqdEvent.count();
}

// Paginated list of all events, soonest first.
export async function getFqdEvents(
  page = 1,
  pageSize = 20,
): Promise<GetFqdEventsResult> {
  const safePage = Math.max(1, page);
  const skip = (safePage - 1) * pageSize;
  const [rows, total] = await Promise.all([
    prisma.fqdEvent.findMany({
      orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
      include: { images: { orderBy: { order: "asc" } } },
      skip,
      take: pageSize,
    }),
    prisma.fqdEvent.count(),
  ]);
  return {
    events: rows.map(serializeFqdEvent),
    total,
    page: safePage,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
