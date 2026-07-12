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

// Replace a single event within a saved snapshot (e.g. after editing it), so
// returning to the list shows the fresh data — new images, title, etc. — rather
// than the pre-edit cache.
export function patchEventInListSnapshot(event: FqdEventListItem): void {
  const snap = readEventsListSnapshot();
  if (!snap) return;
  const idx = snap.events.findIndex((e) => e.id === event.id);
  if (idx === -1) return;
  snap.events = snap.events.map((e) => (e.id === event.id ? event : e));
  writeEventsListSnapshot(snap);
}
