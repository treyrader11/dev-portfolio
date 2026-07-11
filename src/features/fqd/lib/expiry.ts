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
