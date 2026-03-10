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

  const year = new Date().getFullYear();
  const count = await prisma.invoice.count({
    where: {
      invoiceNumber: { startsWith: `INV-${year}` },
    },
  });

  const nextNumber = `INV-${year}-${String(count + 1).padStart(3, "0")}`;
  return res.json({ nextNumber });
}
