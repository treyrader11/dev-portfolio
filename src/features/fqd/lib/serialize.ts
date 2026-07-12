import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { FqdEvent, FqdEventImage, Prisma } from "@prisma/client";
import type {
  FqdEventFormValues,
  FqdEventListItem,
} from "../types/fqd-types";

// A Prisma event row with its images included.
type EventWithImages = FqdEvent & { images: FqdEventImage[] };

// Serialize a Prisma event (Date fields → ISO strings) so it's safe to pass
// through getServerSideProps / API JSON.
export function serializeFqdEvent(row: EventWithImages): FqdEventListItem {
  // startNotifiedAt is an internal Date (cron bookkeeping) — strip it so it
  // never leaks a non-serializable value into getServerSideProps props.
  // rawResearch is the AI payload — don't ship it to the client, but derive an
  // `aiScraped` flag from its presence (any AI research/parse/import sets it).
  const { startNotifiedAt: _startNotifiedAt, rawResearch, ...rest } = row;
  // "New" = created today (server local time). Matches the "New" pill filter.
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return {
    ...rest,
    aiScraped: rawResearch != null,
    isNew: row.createdAt.getTime() >= startOfToday.getTime(),
    startDate: row.startDate.toISOString(),
    endDate: row.endDate ? row.endDate.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    images: row.images.map((img) => ({
      ...img,
      createdAt: img.createdAt.toISOString(),
    })),
  };
}

const orNull = (s: string | undefined | null): string | null => {
  const t = (s ?? "").trim();
  return t.length ? t : null;
};

// Map the form values to the FqdEvent scalar columns (images handled separately).
export function toScalarData(
  values: FqdEventFormValues,
): Omit<Prisma.FqdEventUncheckedCreateInput, "id" | "slug" | "rawResearch"> {
  return {
    title: values.title.trim(),
    startDate: new Date(values.startDate),
    endDate: values.endDate ? new Date(values.endDate) : null,
    startTime: orNull(values.startTime),
    locationName: orNull(values.locationName),
    address: orNull(values.address),
    description: orNull(values.description),
    admission: orNull(values.admission),
    website: orNull(values.website),
    category: orNull(values.category),
    subcategory: orNull(values.subcategory),
    ticketUrl: orNull(values.ticketUrl),
    organizer: orNull(values.organizer),
    expectedAttendance: orNull(values.expectedAttendance),
    ageRequirement: orNull(values.ageRequirement),
    notes: orNull(values.notes),
    status: values.status,
  };
}

// Ensure a unique slug: prefer the provided/derived slug, appending -2, -3, …
// on collision. Ignores the row being updated (excludeId).
export async function ensureUniqueSlug(
  desired: string,
  title: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(desired || title) || "event";
  let slug = base;
  let n = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.fqdEvent.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${n++}`;
  }
}
