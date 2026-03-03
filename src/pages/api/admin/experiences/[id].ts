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
    const item = await prisma.experience.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: "Not found" });
    return res.json(item);
  }

  if (req.method === "PUT") {
    const { title, company, iconUrl, iconBg, date, websiteUrl, points, sortOrder } = req.body;
    const item = await prisma.experience.update({
      where: { id },
      data: { title, company, iconUrl, iconBg, date, websiteUrl, points, sortOrder },
    });
    return res.json(item);
  }

  if (req.method === "DELETE") {
    await prisma.experience.delete({ where: { id } });
    return res.json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
