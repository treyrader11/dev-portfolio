import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!(await requireAdmin(req, res))) return;

  if (req.method === "GET") {
    const items = await prisma.skill.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return res.json(items);
  }

  if (req.method === "POST") {
    const { skillName, imageUrl, width, height, category, sortOrder } = req.body;
    const item = await prisma.skill.create({
      data: { skillName, imageUrl, width: width ?? 80, height: height ?? 80, category: category ?? "all", sortOrder: sortOrder ?? 0 },
    });
    return res.status(201).json(item);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
