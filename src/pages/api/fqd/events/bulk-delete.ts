import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { deleteFqdEventWithImages } from "@/features/fqd/lib/delete-with-images";

export const config = { maxDuration: 60 };

// Delete many events at once (with their Cloudinary images). Best-effort per
// event; returns how many were removed.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { ids } = req.body as { ids?: string[] };
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "No events selected" });
  }

  let deleted = 0;
  for (const id of ids) {
    try {
      await deleteFqdEventWithImages(id);
      deleted += 1;
    } catch (err) {
      console.error(`[fqd] bulk delete failed for ${id}:`, err);
    }
  }

  return res.status(200).json({ deleted });
}
