import { addHours, format, parse } from "date-fns";
import type { FqdEventListItem } from "../types/fqd-types";

// JEvents CSV column order — must stay exactly this.
const HEADERS = [
  "CATEGORIES",
  "SUMMARY",
  "LOCATION",
  "DESCRIPTION",
  "CONTACT",
  "X-EXTRAINFO",
  "DTSTART",
  "DTEND",
  "TIMEZONE",
  "RRULE",
] as const;

const TIMEZONE = "America/Chicago";
const DT_FORMAT = "yyyyMMdd'T'HHmmss";

const str = (v: unknown): string => (v == null ? "" : String(v));

// LOCATION: "locationName - address", or whichever exists, or "".
function locationCell(
  locationName?: string | null,
  address?: string | null,
): string {
  const l = str(locationName).trim();
  const a = str(address).trim();
  if (l && a) return `${l} - ${a}`;
  return l || a || "";
}

// X-EXTRAINFO: admission and ticketUrl joined by " | ", omitting empty sides.
function extraInfoCell(
  admission?: string | null,
  ticketUrl?: string | null,
): string {
  return [str(admission).trim(), str(ticketUrl).trim()]
    .filter(Boolean)
    .join(" | ");
}

// Parse a free-form time string ("6:30 PM", "18:30", "7 PM", …) into
// hours/minutes, or null when it can't be parsed. am/pm formats are tried
// first so "18:30" doesn't accidentally match a 12-hour token.
function timeParts(startTime?: string | null): { h: number; m: number } | null {
  const t = str(startTime).trim();
  if (!t) return null;
  const formats = ["h:mm a", "h:mma", "h a", "ha", "HH:mm", "H:mm", "h:mm"];
  const ref = new Date(2000, 0, 1);
  for (const fmt of formats) {
    const d = parse(t, fmt, ref);
    if (!isNaN(d.getTime())) return { h: d.getHours(), m: d.getMinutes() };
  }
  return null;
}

// DTSTART = start date + start time (or 00:00:00). DTEND = end date (00:00:00)
// when present, else start + 2 hours. Formatted as floating local times for the
// TIMEZONE column (no UTC conversion).
function dtStartEnd(event: FqdEventListItem): { dtStart: string; dtEnd: string } {
  const start = new Date(`${str(event.startDate).slice(0, 10)}T00:00:00`);
  const tp = timeParts(event.startTime);
  if (tp) start.setHours(tp.h, tp.m, 0, 0);

  const end = event.endDate
    ? new Date(`${str(event.endDate).slice(0, 10)}T00:00:00`)
    : addHours(start, 2);

  return {
    dtStart: format(start, DT_FORMAT),
    dtEnd: format(end, DT_FORMAT),
  };
}

function eventCells(event: FqdEventListItem): string[] {
  const { dtStart, dtEnd } = dtStartEnd(event);
  return [
    str(event.category), // CATEGORIES
    str(event.title), // SUMMARY
    locationCell(event.locationName, event.address), // LOCATION
    str(event.description), // DESCRIPTION
    str(event.organizer), // CONTACT
    extraInfoCell(event.admission, event.ticketUrl), // X-EXTRAINFO
    dtStart, // DTSTART
    dtEnd, // DTEND
    TIMEZONE, // TIMEZONE
    "", // RRULE (always empty)
  ];
}

// Wrap every field in double quotes; escape inner quotes by doubling them.
const csvCell = (value: string): string => `"${value.replace(/"/g, '""')}"`;
const csvRow = (cells: readonly string[]): string => cells.map(csvCell).join(",");

const CRLF = "\r\n";

// A single-row JEvents CSV (header + one row) for a per-event event.csv.
export function generateEventCsv(event: FqdEventListItem): string {
  return [csvRow(HEADERS), csvRow(eventCells(event))].join(CRLF);
}

// A multi-row JEvents CSV (header + one row per event) for the root combined CSV.
export function generateCombinedCsv(events: FqdEventListItem[]): string {
  return [csvRow(HEADERS), ...events.map((e) => csvRow(eventCells(e)))].join(
    CRLF,
  );
}
