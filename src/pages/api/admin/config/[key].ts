import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/admin/lib/admin-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!(await requireAdmin(req, res))) return;

  const key = req.query.key as string;

  if (req.method === "GET") {
    const config = await prisma.siteConfig.findUnique({ where: { key } });
    if (!config) return res.status(404).json({ error: "Not found" });
    return res.json(config);
  }

  if (req.method === "PUT") {
    const { value } = req.body;
    const config = await prisma.siteConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    return res.json(config);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
