import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!(await requireAdmin(req, res))) return;

  if (req.method === "GET") {
    const { date, from, to, ticketKey, invoiced } = req.query;

    const where: Record<string, unknown> = {};

    if (date) {
      const d = new Date(date as string);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      where.startTime = { gte: d, lt: nextDay };
    } else if (from && to) {
      where.startTime = {
        gte: new Date(from as string),
        lte: new Date(to as string),
      };
    }

    if (ticketKey) {
      where.ticketKey = ticketKey as string;
    }

    if (invoiced === "false") {
      where.invoiceId = null;
    }

    const items = await prisma.timeEntry.findMany({
      where,
      orderBy: { startTime: "desc" },
      include: { invoice: { select: { invoiceNumber: true } } },
    });

    return res.json(items);
  }

  if (req.method === "POST") {
    const { ticketKey, ticketSummary, projectKey, projectName, notes } =
      req.body;

    // Stop any currently running timer first
    const running = await prisma.timeEntry.findFirst({
      where: { endTime: null },
    });
    if (running) {
      const now = new Date();
      await prisma.timeEntry.update({
        where: { id: running.id },
        data: {
          endTime: now,
          duration: Math.round(
            (now.getTime() - running.startTime.getTime()) / 1000
          ),
        },
      });
    }

    const entry = await prisma.timeEntry.create({
      data: {
        ticketKey,
        ticketSummary,
        projectKey: projectKey || null,
        projectName: projectName || null,
        startTime: new Date(),
        notes: notes || null,
      },
    });

    return res.status(201).json(entry);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
