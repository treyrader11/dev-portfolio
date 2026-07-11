import type { NextApiRequest, NextApiResponse } from "next";
import { cloudinary } from "@/lib/cloudinary";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import {
  normalizeUrl,
  extractImageUrls,
} from "@/features/fqd/lib/scrape-images";

export const config = { maxDuration: 30 };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body as { url?: string };
  const target = url ? normalizeUrl(url) : null;
  if (!target) return res.status(400).json({ error: "Invalid website URL" });

  // Fetch the page HTML (bounded time).
  let html: string;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const resp = await fetch(target.href, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; FQDBot/1.0)" },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!resp.ok) return res.status(200).json({ images: [] });
    html = await resp.text();
  } catch {
    return res.status(200).json({ images: [] });
  }

  const imageUrls = extractImageUrls(html, target);
  if (imageUrls.length === 0) return res.status(200).json({ images: [] });

  // Upload each to Cloudinary by URL (so it becomes a normal event image and
  // works with next/image). Best-effort per image.
  const images: { url: string; cloudinaryId: string }[] = [];
  for (const imageUrl of imageUrls) {
    try {
      const uploaded = await cloudinary.uploader.upload(imageUrl, {
        folder: "fqd/events",
      });
      images.push({ url: uploaded.secure_url, cloudinaryId: uploaded.public_id });
    } catch {
      /* skip images Cloudinary can't fetch */
    }
  }

  return res.status(200).json({ images });
}
