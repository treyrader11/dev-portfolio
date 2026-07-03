import type { NextApiRequest, NextApiResponse } from "next";
import { cloudinary } from "@/lib/cloudinary";
import { requireAdmin } from "@/features/admin/lib/admin-auth";

// Media library for the profile avatar: list previously uploaded images in the
// `profile/` folder, and permanently delete one (the only thing that deletes —
// changing your avatar never removes an image). Admin-only.
const FOLDER = "profile";

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  created_at: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;

  if (req.method === "GET") {
    try {
      const result = (await cloudinary.api.resources({
        type: "upload",
        prefix: `${FOLDER}/`,
        max_results: 100,
      })) as { resources?: CloudinaryResource[] };

      const images = (result.resources ?? [])
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
        .map((r) => ({ publicId: r.public_id, url: r.secure_url }));

      return res.status(200).json({ images });
    } catch {
      return res.status(500).json({ error: "Could not list images" });
    }
  }

  if (req.method === "DELETE") {
    const { publicId } = req.body as { publicId?: string };
    if (!publicId) return res.status(400).json({ error: "Missing publicId" });
    try {
      await cloudinary.uploader.destroy(publicId);
      return res.status(200).json({ success: true });
    } catch {
      return res.status(500).json({ error: "Could not delete image" });
    }
  }

  res.setHeader("Allow", ["GET", "DELETE"]);
  return res.status(405).json({ error: "Method not allowed" });
}
