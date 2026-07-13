// If a start date is present but the end date is blank, default the end date to
// the start date (a single-day event). Applied when AI auto-populates event
// fields so a known start date never leaves the end date empty.
export function withDefaultEndDate<
  T extends { startDate?: string | null; endDate?: string | null },
>(fields: T): T {
  const start = fields.startDate?.trim();
  const endBlank = !fields.endDate || !fields.endDate.trim();
  if (start && endBlank) {
    return { ...fields, endDate: start };
  }
  return fields;
}
