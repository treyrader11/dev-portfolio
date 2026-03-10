import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!(await requireAdmin(req, res))) return;

  const id = req.query.id as string;

  if (req.method === "GET") {
    const item = await prisma.timeEntry.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: "Not found" });
    return res.json(item);
  }

  if (req.method === "PUT") {
    const { endTime, notes, invoiceId } = req.body;
    const data: Record<string, unknown> = {};

    if (endTime !== undefined) {
      const entry = await prisma.timeEntry.findUnique({ where: { id } });
      if (!entry) return res.status(404).json({ error: "Not found" });
      const end = new Date(endTime);
      data.endTime = end;
      data.duration = Math.round(
        (end.getTime() - entry.startTime.getTime()) / 1000
      );
    }

    if (notes !== undefined) data.notes = notes;
    if (invoiceId !== undefined) data.invoiceId = invoiceId;

    const item = await prisma.timeEntry.update({ where: { id }, data });
    return res.json(item);
  }

  if (req.method === "DELETE") {
    await prisma.timeEntry.delete({ where: { id } });
    return res.json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
