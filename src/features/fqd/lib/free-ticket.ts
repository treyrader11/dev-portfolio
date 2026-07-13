// True when the admission text says the event is free and mentions no price.
// "Free admission" / "Free" → true; "Free for members, $10 general" → false.
export function isFreeAdmission(admission?: string | null): boolean {
  const a = (admission ?? "").toLowerCase().trim();
  if (!a) return false;
  const mentionsFree = /\b(free|no charge|no cost|complimentary)\b/.test(a);
  const mentionsPrice =
    /\$\s?\d|\b\d+\s?(dollars|usd)\b|\bpaid\b|\bpurchase\b|\bticket price\b|\bfrom \$/.test(
      a,
    );
  return mentionsFree && !mentionsPrice;
}

// If the event is free and has no ticket URL, set the ticket field to "Free".
export function withFreeTicketUrl<
  T extends { admission?: string | null; ticketUrl?: string | null },
>(fields: T): T {
  const ticketBlank = !fields.ticketUrl || !fields.ticketUrl.trim();
  if (ticketBlank && isFreeAdmission(fields.admission)) {
    return { ...fields, ticketUrl: "Free" };
  }
  return fields;
}
