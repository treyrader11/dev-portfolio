import type { NextApiRequest, NextApiResponse } from "next";
import { cloudinary } from "@/lib/cloudinary";
import { requireAdmin } from "@/features/admin/lib/admin-auth";

export const config = { maxDuration: 30 };

// Normalize a possibly-protocol-less URL and reject anything that isn't public
// http(s) (basic SSRF guard for this admin-only tool).
function normalizeUrl(input: string): URL | null {
  try {
    const url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    const host = url.hostname;
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".local") ||
      /^(10\.|192\.168\.|169\.254\.)/.test(host)
    ) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

// Pull the representative social-share images (og:image / twitter:image) out of
// a page's HTML, resolved to absolute URLs.
function extractImageUrls(html: string, base: URL): string[] {
  const patterns = [
    /<meta[^>]+property=["']og:image(?::secure_url|:url)?["'][^>]+content=["']([^"']+)["']/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url|:url)?["']/gi,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/gi,
  ];
  const found: string[] = [];
  for (const re of patterns) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
      try {
        const abs = new URL(m[1], base).href;
        if (/^https?:\/\//i.test(abs)) found.push(abs);
      } catch {
        /* skip bad url */
      }
    }
  }
  return [...new Set(found)].slice(0, 3);
}

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
