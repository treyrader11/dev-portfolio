import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const config = { maxDuration: 60 };

// Set the "added to French Quarter Direct" flag on many events at once.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { ids, added } = req.body as { ids?: string[]; added?: boolean };
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "No events selected" });
  }
  if (typeof added !== "boolean") {
    return res.status(400).json({ error: "`added` must be a boolean" });
  }

  const result = await prisma.fqdEvent.updateMany({
    where: { id: { in: ids } },
    data: { addedToJoomla: added },
  });

  return res.status(200).json({ updated: result.count });
}
