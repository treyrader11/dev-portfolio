import type { Prisma } from "@prisma/client";

// Start of today (UTC). An event is expired once the current date is past its
// end date — i.e. the effective end (endDate, or startDate when there's no
// endDate) is before today.
export function expiredCutoff(now: Date = new Date()): Date {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

export function expiredEventsWhere(cutoff: Date): Prisma.FqdEventWhereInput {
  return {
    OR: [
      { endDate: { lt: cutoff } },
      { AND: [{ endDate: null }, { startDate: { lt: cutoff } }] },
    ],
  };
}

// The inverse of expiredEventsWhere, written POSITIVELY (an event is live when
// its effective end — endDate, or startDate when there's no endDate — is on or
// after the cutoff). Do NOT filter with `{ NOT: expiredEventsWhere(cutoff) }`:
// in SQL, `NOT(endDate < cutoff)` is NULL (not true) for a null endDate, so
// every single-day event with no end date is wrongly dropped from the results.
export function notExpiredEventsWhere(cutoff: Date): Prisma.FqdEventWhereInput {
  return {
    OR: [
      { endDate: { gte: cutoff } },
      { AND: [{ endDate: null }, { startDate: { gte: cutoff } }] },
    ],
  };
}
