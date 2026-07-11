import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import {
  loadDuplicateIndex,
  matchDuplicate,
} from "@/features/fqd/lib/duplicates";

// Given a list of candidate events, return which ones already exist (aligned by
// index) so the import review UI can flag duplicates before creating anything.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { events } = req.body as {
    events?: { title?: string | null; startDate?: string | null }[];
  };
  if (!Array.isArray(events)) {
    return res.status(400).json({ error: "No events provided" });
  }

  const index = await loadDuplicateIndex();
  const duplicates = events.map((e) =>
    e?.title ? matchDuplicate(index, e.title, e.startDate) : null,
  );
  return res.status(200).json({ duplicates });
}
