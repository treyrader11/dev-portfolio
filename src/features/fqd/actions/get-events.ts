import type { Prisma } from "@prisma/client";
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

// Combine the optional missing-field, search, and added filters.
function buildWhere(
  missing?: string,
  search?: string,
  added?: string,
): Prisma.FqdEventWhereInput | undefined {
  const clauses = [
    missingWhere(missing),
    searchWhere(search),
    addedWhere(added),
  ].filter((c): c is Prisma.FqdEventWhereInput => !!c);
  if (clauses.length === 0) return undefined;
  if (clauses.length === 1) return clauses[0];
  return { AND: clauses };
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
): Promise<GetFqdEventsResult> {
  const safePage = Math.max(1, page);
  const skip = (safePage - 1) * pageSize;
  const where = buildWhere(missing, search, added);
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
