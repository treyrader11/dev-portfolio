import type { NextApiRequest, NextApiResponse } from "next";
import { cloudinary } from "@/lib/cloudinary";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import {
  researchEventImageSourcesWithFallback,
  FqdAllProvidersError,
  isQuotaError,
} from "@/features/fqd/lib/fqd-research";
import { resolveImageCandidates } from "@/features/fqd/lib/scrape-images";
import { parseFqdProvider } from "@/features/fqd/types/fqd-types";

export const config = { maxDuration: 60 };

interface Body {
  title?: string;
  locationName?: string;
  address?: string;
  startDate?: string;
  category?: string;
  subcategory?: string;
  website?: string;
  description?: string;
  provider?: string;
}

// Build a compact search query from whatever event details we have.
function buildQuery(b: Body): string {
  const year = b.startDate ? b.startDate.slice(0, 4) : "";
  return [
    b.title,
    year,
    b.locationName,
    b.address,
    b.category,
    b.subcategory,
    b.website ? `official site ${b.website}` : "",
    b.description ? `— ${b.description.slice(0, 200)}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

// AI web-search for images of an event, then upload the found images to
// Cloudinary so they're ready to crop/reorder in the form.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body as Body;
  if (!body.title?.trim()) {
    return res
      .status(400)
      .json({ error: "Add a title first so the search has something to go on" });
  }

  // 1) AI web search → candidate URLs (image files or pages).
  let sources: string[];
  let provider: string;
  try {
    const result = await researchEventImageSourcesWithFallback(
      buildQuery(body),
      parseFqdProvider(body.provider),
    );
    sources = result.data;
    provider = result.provider;
  } catch (err) {
    if (err instanceof FqdAllProvidersError) {
      const quota = isQuotaError(err.attempts);
      return res.status(quota ? 429 : 502).json({
        code: quota ? "quota" : "failed",
        error: err.attempts.join(" · ") || "Image search failed",
        attempts: err.attempts,
      });
    }
    return res.status(500).json({
      code: "failed",
      error: err instanceof Error ? err.message : "Image search failed",
    });
  }

  // Seed with the known website too, in case the model didn't include it.
  const candidates = body.website
    ? [body.website, ...sources]
    : sources;

  // 2) Resolve candidates to direct image URLs (scrape og:image from pages).
  const imageUrls = await resolveImageCandidates(candidates, 15);
  if (imageUrls.length === 0) {
    return res.status(200).json({ images: [], provider });
  }

  // 3) Upload each to Cloudinary (best-effort) so they become normal event
  // images that work with next/image and the crop tools.
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

  return res.status(200).json({ images, provider });
}
