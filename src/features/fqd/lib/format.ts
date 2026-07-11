const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Deterministic (UTC) "Mon D, YYYY" — renders identically on server and client.
export function fmtEventDate(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

// "Mon D, YYYY" for a single-day event, or "Mon D, YYYY – Mon D, YYYY" for a
// range. Pass the ISO start and optional end.
export function eventDateRange(
  startIso: string,
  endIso?: string | null,
): string {
  const sameDay = !endIso || endIso.slice(0, 10) === startIso.slice(0, 10);
  return sameDay
    ? fmtEventDate(startIso)
    : `${fmtEventDate(startIso)} – ${fmtEventDate(endIso)}`;
}

// The date range with the start time appended (e.g. "Jul 5, 2026 · 6:30 PM").
export function eventDateLabel(event: {
  startDate: string;
  endDate?: string | null;
  startTime?: string | null;
}): string {
  const base = eventDateRange(event.startDate, event.endDate);
  return event.startTime ? `${base} · ${event.startTime}` : base;
}
