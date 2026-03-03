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
    const item = await prisma.skill.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: "Not found" });
    return res.json(item);
  }

  if (req.method === "PUT") {
    const { skillName, imageUrl, width, height, category, sortOrder } = req.body;
    const item = await prisma.skill.update({
      where: { id },
      data: { skillName, imageUrl, width, height, category, sortOrder },
    });
    return res.json(item);
  }

  if (req.method === "DELETE") {
    await prisma.skill.delete({ where: { id } });
    return res.json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
