// Normalize a possibly-protocol-less URL and reject anything that isn't public
// http(s) (basic SSRF guard for these admin-only tools).
export function normalizeUrl(input: string): URL | null {
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
export function extractImageUrls(html: string, base: URL, limit = 3): string[] {
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
  return [...new Set(found)].slice(0, limit);
}

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)(\?|#|$)/i;

// Resolve a mix of candidate URLs (direct image files or pages) into a deduped
// list of direct image URLs. Image files are kept as-is; pages are fetched and
// their og:image/twitter:image extracted. Bounded per-fetch time + overall count.
export async function resolveImageCandidates(
  urls: string[],
  limit = 6,
): Promise<string[]> {
  const out: string[] = [];
  const seen = new Set<string>();
  const push = (u: string) => {
    if (!seen.has(u) && out.length < limit) {
      seen.add(u);
      out.push(u);
    }
  };

  for (const raw of urls) {
    if (out.length >= limit) break;
    const target = normalizeUrl(raw);
    if (!target) continue;

    if (IMAGE_EXT.test(target.pathname)) {
      push(target.href);
      continue;
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      const resp = await fetch(target.href, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; FQDBot/1.0)" },
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!resp.ok) continue;
      const contentType = resp.headers.get("content-type") ?? "";
      if (contentType.startsWith("image/")) {
        push(target.href);
      } else if (contentType.includes("html")) {
        for (const img of extractImageUrls(await resp.text(), target, 3)) {
          push(img);
        }
      }
    } catch {
      /* skip unreachable candidate */
    }
  }

  return out;
}
