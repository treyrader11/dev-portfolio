import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!(await requireAdmin(req, res))) return;

  const period = (req.query.period as string) || "day";
  const dateStr = (req.query.date as string) || new Date().toISOString().split("T")[0];
  const date = new Date(dateStr);

  let from: Date;
  let to: Date;

  if (period === "week") {
    const day = date.getDay();
    const diff = day === 0 ? 6 : day - 1; // Monday start
    from = new Date(date);
    from.setDate(from.getDate() - diff);
    from.setHours(0, 0, 0, 0);
    to = new Date(from);
    to.setDate(to.getDate() + 7);
  } else {
    from = new Date(date);
    from.setHours(0, 0, 0, 0);
    to = new Date(from);
    to.setDate(to.getDate() + 1);
  }

  const entries = await prisma.timeEntry.findMany({
    where: {
      startTime: { gte: from, lt: to },
      endTime: { not: null },
    },
    orderBy: { startTime: "desc" },
  });

  const totalSeconds = entries.reduce((sum, e) => sum + (e.duration || 0), 0);

  const byTicket: Record<
    string,
    { ticketKey: string; ticketSummary: string; totalSeconds: number }
  > = {};

  for (const e of entries) {
    if (!byTicket[e.ticketKey]) {
      byTicket[e.ticketKey] = {
        ticketKey: e.ticketKey,
        ticketSummary: e.ticketSummary,
        totalSeconds: 0,
      };
    }
    byTicket[e.ticketKey].totalSeconds += e.duration || 0;
  }

  return res.json({
    totalSeconds,
    totalHours: Math.round((totalSeconds / 3600) * 100) / 100,
    entries,
    byTicket,
  });
}
