import { cloudinary } from "@/lib/cloudinary";

// Download filename for an event image, following the admin naming rule:
//   single image → "running-of-the-bulls.png"
//   multiple     → "running-of-the-bulls(1).png", "running-of-the-bulls(2).png", …
// Indexing is 1-based (never 0-based) and every image is a .png.
export function eventImageFilename(
  slug: string | null | undefined,
  index: number,
  total: number,
): string {
  const base = (slug || "event").trim() || "event";
  return total <= 1 ? `${base}.png` : `${base}(${index + 1}).png`;
}

// A Cloudinary delivery URL that forces PNG output, preferring the stored
// public_id and falling back to injecting an `f_png` transformation into a
// standard delivery URL.
export function pngDeliveryUrl(
  url: string,
  cloudinaryId?: string | null,
): string {
  if (cloudinaryId) {
    return cloudinary.url(cloudinaryId, { format: "png", secure: true });
  }
  return url.replace(/\/upload\/(v\d+\/)?/, (_m, v = "") => `/upload/f_png/${v}`);
}
