import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { getAllFqdEventsBrief } from "@/features/fqd/actions/get-events-brief";

// Brief list of all active events for the export-selection modal.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }
  const events = await getAllFqdEventsBrief();
  return res.status(200).json({ events });
}
