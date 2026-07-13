import type { Prisma } from "@prisma/client";
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

// String columns that can be filtered for "missing" (null or empty).
const MISSING_STRING_FIELDS = new Set([
  "description",
  "startTime",
  "locationName",
  "address",
  "category",
  "subcategory",
  "admission",
  "ticketUrl",
  "organizer",
  "expectedAttendance",
  "ageRequirement",
  "website",
  "notes",
]);

// A where-clause matching events that are MISSING the given field. "images"
// means no images; "endDate" means no end date; the rest are string columns.
function missingWhere(field?: string): Prisma.FqdEventWhereInput | undefined {
  if (!field) return undefined;
  // "incomplete" = missing ANY tracked field (matches the card's checklist).
  if (field === "incomplete") {
    return {
      OR: [
        { images: { none: {} } },
        { endDate: null },
        ...Array.from(MISSING_STRING_FIELDS).map(
          (f) =>
            ({ OR: [{ [f]: null }, { [f]: "" }] }) as Prisma.FqdEventWhereInput,
        ),
      ],
    };
  }
  if (field === "images") return { images: { none: {} } };
  if (field === "endDate") return { endDate: null };
  if (MISSING_STRING_FIELDS.has(field)) {
    return {
      OR: [{ [field]: null }, { [field]: "" }],
    } as Prisma.FqdEventWhereInput;
  }
  return undefined;
}

// A where-clause matching a free-text query against title / location / address.
function searchWhere(search?: string): Prisma.FqdEventWhereInput | undefined {
  const q = search?.trim();
  if (!q) return undefined;
  return {
    OR: [
      { title: { contains: q, mode: "insensitive" } },
      { locationName: { contains: q, mode: "insensitive" } },
      { address: { contains: q, mode: "insensitive" } },
    ],
  };
}

// A where-clause for the "added to Joomla" pill filter.
function addedWhere(added?: string): Prisma.FqdEventWhereInput | undefined {
  if (added === "true") return { addedToJoomla: true };
  if (added === "false") return { addedToJoomla: false };
  return undefined;
}

// A where-clause for the "New" pill filter: events created today (server time).
function newWhere(newOnly?: string): Prisma.FqdEventWhereInput | undefined {
  if (newOnly !== "true") return undefined;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return { createdAt: { gte: start } };
}

// Combine the optional missing-field, search, added, and new filters.
function buildWhere(
  missing?: string,
  search?: string,
  added?: string,
  newOnly?: string,
): Prisma.FqdEventWhereInput | undefined {
  const clauses = [
    missingWhere(missing),
    searchWhere(search),
    addedWhere(added),
    newWhere(newOnly),
  ].filter((c): c is Prisma.FqdEventWhereInput => !!c);
  if (clauses.length === 0) return undefined;
  if (clauses.length === 1) return clauses[0];
  return { AND: clauses };
}

// The active filters for the events list. Shared by the paginated list and the
// export brief so exports respect whatever filter/tab is currently active.
export interface FqdEventFilters {
  missing?: string;
  search?: string;
  added?: string;
  newOnly?: string;
}

// The full WHERE for the visible events list: the active filters plus the
// always-on "not expired" guard. Reused by the export-list query so its results
// match exactly what the list shows.
export function fqdEventsListWhere(
  f: FqdEventFilters = {},
): Prisma.FqdEventWhereInput {
  const filters = buildWhere(f.missing, f.search, f.added, f.newOnly);
  const notExpired: Prisma.FqdEventWhereInput = {
    NOT: expiredEventsWhere(expiredCutoff()),
  };
  return filters ? { AND: [filters, notExpired] } : notExpired;
}

// Total number of events in the database. The admin manages every event it
// holds — past events are removed by the expiry cron, not hidden here.
export async function getFqdEventCount(): Promise<number> {
  return prisma.fqdEvent.count();
}

// Paginated list of events, soonest first. `missing` filters to events lacking
// a given field; `search` matches title / location / address.
export async function getFqdEvents(
  page = 1,
  pageSize = 20,
  missing?: string,
  search?: string,
  added?: string,
  newOnly?: string,
): Promise<GetFqdEventsResult> {
  const safePage = Math.max(1, page);
  const skip = (safePage - 1) * pageSize;
  // Never show expired events (past their end date). They're emailed + removed
  // by the expiry cron / lazy pass, but hide them here too so they never linger
  // in the list before that runs.
  const where = fqdEventsListWhere({ missing, search, added, newOnly });
  const [rows, total] = await Promise.all([
    prisma.fqdEvent.findMany({
      where,
      orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
      include: { images: { orderBy: { order: "asc" } } },
      skip,
      take: pageSize,
    }),
    prisma.fqdEvent.count({ where }),
  ]);
  return {
    events: rows.map(serializeFqdEvent),
    total,
    page: safePage,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
