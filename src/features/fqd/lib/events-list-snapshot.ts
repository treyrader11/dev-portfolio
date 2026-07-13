import type { FqdEventListItem } from "../types/fqd-types";

// Client-side snapshot of the events list (loaded events + filters + scroll),
// used to resume the list where the user left off after navigating away.
export const EVENTS_LIST_SNAPSHOT_KEY = "fqd-events-list-snapshot";

export interface EventsListSnapshot {
  events: FqdEventListItem[];
  total: number;
  page: number;
  filter: string;
  missing: string;
  added: string;
  newOnly: string;
  scrollY: number;
}

export function readEventsListSnapshot(): EventsListSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(EVENTS_LIST_SNAPSHOT_KEY);
    return raw ? (JSON.parse(raw) as EventsListSnapshot) : null;
  } catch {
    return null;
  }
}

export function writeEventsListSnapshot(snap: EventsListSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(EVENTS_LIST_SNAPSHOT_KEY, JSON.stringify(snap));
  } catch {
    /* storage unavailable */
  }
}

export function clearEventsListSnapshot(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(EVENTS_LIST_SNAPSHOT_KEY);
  } catch {
    /* ignore */
  }
}

const isBlank = (v?: string | null) => !v || !String(v).trim();

// Tracked string fields the "missing"/"incomplete" filter checks (mirrors
// get-events.ts).
const MISSING_STRING_FIELDS = [
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
] as const;

// Whether an event is "missing" the given field (matches the server filter).
function eventIsMissing(e: FqdEventListItem, field: string): boolean {
  if (field === "images") return e.images.length === 0;
  if (field === "endDate") return !e.endDate;
  if (field === "incomplete") {
    return (
      e.images.length === 0 ||
      !e.endDate ||
      MISSING_STRING_FIELDS.some((f) => isBlank((e as Record<string, unknown>)[f] as string))
    );
  }
  if ((MISSING_STRING_FIELDS as readonly string[]).includes(field)) {
    return isBlank((e as Record<string, unknown>)[field] as string);
  }
  return false;
}

// Whether an event still matches the snapshot's active filters (search / added /
// new / missing) — same rules as the server list query, so an edited event that
// no longer qualifies can be dropped from the restored list.
function matchesSnapshotFilters(
  e: FqdEventListItem,
  snap: EventsListSnapshot,
): boolean {
  if (snap.added === "true" && !e.addedToJoomla) return false;
  if (snap.added === "false" && e.addedToJoomla) return false;
  if (snap.newOnly === "true" && !e.isNew) return false;
  const q = snap.filter?.trim().toLowerCase();
  if (q) {
    const hay = [e.title, e.locationName, e.address]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (snap.missing && !eventIsMissing(e, snap.missing)) return false;
  return true;
}

// Update a single event within a saved snapshot after editing it. If it still
// matches the active filters, refresh its data in place; if the edit made it no
// longer match (e.g. you filled the last missing field under "Incomplete"), drop
// it from the restored list so returning reflects the change.
export function patchEventInListSnapshot(event: FqdEventListItem): void {
  const snap = readEventsListSnapshot();
  if (!snap) return;
  const idx = snap.events.findIndex((e) => e.id === event.id);
  if (idx === -1) return;
  if (matchesSnapshotFilters(event, snap)) {
    snap.events = snap.events.map((e) => (e.id === event.id ? event : e));
  } else {
    snap.events = snap.events.filter((e) => e.id !== event.id);
    snap.total = Math.max(0, snap.total - 1);
  }
  writeEventsListSnapshot(snap);
}
