import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { FQD_STATUSES, type FqdStatus } from "@/features/fqd/types/fqd-types";

export const config = { maxDuration: 60 };

// Set the workflow status on many events at once.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { ids, status } = req.body as { ids?: string[]; status?: string };
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "No events selected" });
  }
  if (
    typeof status !== "string" ||
    !FQD_STATUSES.includes(status as FqdStatus)
  ) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const result = await prisma.fqdEvent.updateMany({
    where: { id: { in: ids } },
    data: { status },
  });

  return res.status(200).json({ updated: result.count });
}
