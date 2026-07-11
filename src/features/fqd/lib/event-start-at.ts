// New Orleans is US Central. We treat the free-text start time as Central and
// convert to UTC with a fixed offset. This is a best-effort approximation for a
// reminder — good enough given start times are free-form text; it can be off by
// an hour across a DST boundary.
const NOLA_OFFSET_HOURS = 5; // CDT (summer). CST would be 6.

// Parse a free-text start time ("6:30 AM", "6 PM", "18:00", "noon") into
// hours/minutes, or null when it can't be understood.
export function parseStartTime(
  startTime?: string | null,
): { h: number; m: number } | null {
  if (!startTime) return null;
  const s = startTime.trim().toLowerCase();
  if (/\bnoon\b/.test(s)) return { h: 12, m: 0 };
  if (/\bmidnight\b/.test(s)) return { h: 0, m: 0 };

  const match = s.match(/(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)?/);
  if (!match) return null;
  let h = parseInt(match[1], 10);
  const m = match[2] ? parseInt(match[2], 10) : 0;
  if (h > 23 || m > 59) return null;
  const meridiem = match[3]?.replace(/\./g, "");
  if (meridiem === "pm" && h < 12) h += 12;
  if (meridiem === "am" && h === 12) h = 0;
  return { h, m };
}

// The UTC moment an event begins: its date combined with a best-effort parse of
// the start time (interpreted as New Orleans local). Falls back to the start of
// the day when the time can't be parsed.
export function eventStartAt(
  startDate: Date,
  startTime?: string | null,
): Date {
  const t = parseStartTime(startTime);
  return new Date(
    Date.UTC(
      startDate.getUTCFullYear(),
      startDate.getUTCMonth(),
      startDate.getUTCDate(),
      (t?.h ?? 0) + NOLA_OFFSET_HOURS,
      t?.m ?? 0,
    ),
  );
}
