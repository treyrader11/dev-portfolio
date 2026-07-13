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

// Strip markdown link syntax and bare URL citation artifacts that AI responses
// leave in free-text fields, so DESCRIPTION / X-EXTRAINFO are plain text.
//   "[Jazz Fest](https://x.com)"  -> "Jazz Fest"
//   "Great show (https://x.com)"  -> "Great show"
function stripMarkdownLinks(value: string): string {
  return value
    // Markdown links: [text](url) -> text
    .replace(/\[([^\]]*?)\]\([^)]*?\)/g, "$1")
    // Bare parenthesized URL citations: "(https://…)" / "(www.…)" -> removed
    .replace(/\(\s*(?:https?:\/\/|www\.)[^)\s]*\s*\)/gi, "")
    // Tidy up whitespace left behind (double spaces, space before punctuation)
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+([,.;:!?])/g, "$1")
    .trim();
}

// Max length for X-EXTRAINFO — AI research can produce full paragraphs, which
// bloat the CSV; keep it short.
const MAX_EXTRA_INFO = 200;

const ELLIPSIS = "...";

// Truncate so the FINAL string (including the appended "...") is at most `max`
// characters. The ellipsis counts toward the limit, so content is cut at
// `max - 3`, then trimmed back to the last complete word. No-op when already
// within the limit.
function truncateWords(value: string, max: number): string {
  if (value.length <= max) return value;
  const budget = Math.max(0, max - ELLIPSIS.length);
  const slice = value.slice(0, budget);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : slice;
  return `${cut.trimEnd()}${ELLIPSIS}`;
}

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
// only when it is strictly after the start; otherwise start + 2 hours. Formatted
// as floating local times for the TIMEZONE column (no UTC conversion).
function dtStartEnd(event: FqdEventListItem): { dtStart: string; dtEnd: string } {
  const start = new Date(`${str(event.startDate).slice(0, 10)}T00:00:00`);
  const tp = timeParts(event.startTime);
  if (tp) start.setHours(tp.h, tp.m, 0, 0);

  // The candidate end from endDate (midnight of that day), or null when unset.
  const endFromDate = event.endDate
    ? new Date(`${str(event.endDate).slice(0, 10)}T00:00:00`)
    : null;

  // DTEND fix — before/after so this is verifiably the right place:
  //   BEFORE: `event.endDate ? endDate@midnight : addHours(start, 2)`
  //           A single-day event whose endDate is null OR equal to startDate
  //           emitted DTEND "YYYYMMDDT000000" (midnight of the start date).
  //   AFTER:  use endDate only when strictly AFTER start; else take the
  //           startDate and add 2 hours via addHours, then format below.
  //           e.g. start 20260708T183000 -> DTEND 20260708T203000
  //                start 20260708T000000 -> DTEND 20260708T020000 (never T000000)
  const end =
    endFromDate && endFromDate.getTime() > start.getTime()
      ? endFromDate
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
    stripMarkdownLinks(str(event.description)), // DESCRIPTION
    str(event.organizer), // CONTACT
    truncateWords(
      stripMarkdownLinks(extraInfoCell(event.admission, event.ticketUrl)),
      MAX_EXTRA_INFO,
    ), // X-EXTRAINFO

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
