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
  // Respect the active list filters so the export only includes what's shown.
  const one = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;
  const events = await getAllFqdEventsBrief({
    missing: one(req.query.missing),
    search: one(req.query.search),
    added: one(req.query.added),
    newOnly: one(req.query.new),
  });
  return res.status(200).json({ events });
}
