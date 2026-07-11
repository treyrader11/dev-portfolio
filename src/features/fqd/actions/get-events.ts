import { prisma } from "@/lib/prisma";
import { serializeFqdEvent } from "../lib/serialize";
import { expiredCutoff, expiredEventsWhere } from "../lib/expiry";
import type { FqdEventListItem } from "../types/fqd-types";

export interface GetFqdEventsResult {
  events: FqdEventListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Paginated list of all events, soonest first.
export async function getFqdEvents(
  page = 1,
  pageSize = 20,
): Promise<GetFqdEventsResult> {
  const safePage = Math.max(1, page);
  const skip = (safePage - 1) * pageSize;
  // Hide events whose end date has passed (they're pending cleanup / removed).
  const active = { NOT: expiredEventsWhere(expiredCutoff()) };
  const [rows, total] = await Promise.all([
    prisma.fqdEvent.findMany({
      where: active,
      orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
      include: { images: { orderBy: { order: "asc" } } },
      skip,
      take: pageSize,
    }),
    prisma.fqdEvent.count({ where: active }),
  ]);
  return {
    events: rows.map(serializeFqdEvent),
    total,
    page: safePage,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
