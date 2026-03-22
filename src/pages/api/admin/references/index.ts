import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/admin/lib/admin-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!(await requireAdmin(req, res))) return;

  if (req.method === "GET") {
    const items = await prisma.reference.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return res.json(items);
  }

  if (req.method === "POST") {
    const { name, role, company, imageUrl, text, sortOrder } = req.body;
    const item = await prisma.reference.create({
      data: { name, role, company, imageUrl, text, sortOrder: sortOrder ?? 0 },
    });
    return res.status(201).json(item);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
