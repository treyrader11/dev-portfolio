import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/admin/lib/admin-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!(await requireAdmin(req, res))) return;

  if (req.method === "GET") {
    const items = await prisma.experience.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return res.json(items);
  }

  if (req.method === "POST") {
    const { title, company, iconUrl, iconBg, date, websiteUrl, points, sortOrder } = req.body;
    const item = await prisma.experience.create({
      data: { title, company, iconUrl, iconBg, date, websiteUrl, points, sortOrder: sortOrder ?? 0 },
    });
    return res.status(201).json(item);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
