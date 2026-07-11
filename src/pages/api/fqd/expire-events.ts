import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { serializeFqdEvent } from "@/features/fqd/lib/serialize";
import { expiredCutoff, expiredEventsWhere } from "@/features/fqd/lib/expiry";
import { EventExpiredEmail } from "@/features/fqd/emails/event-expired";

export const config = { maxDuration: 60 };

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM =
  process.env.RESEND_AUTOREPLY_FROM_EMAIL || "Trey Rader <noreply@treyrader.dev>";
const TO = "trey@treyrader.dev";

// Authorize either a Vercel Cron invocation (Bearer CRON_SECRET) or a
// signed-in admin (so it can also be triggered manually from the CMS).
async function authorize(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<boolean> {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization === `Bearer ${secret}`) return true;
  return requireAdmin(req, res);
}

// Finds every event whose end date has passed, emails its full details to Trey,
// deletes its images from Cloudinary, then removes it (and its image rows) from
// the database. Idempotent — re-running only processes events that still exist.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await authorize(req, res))) {
    // requireAdmin already responded; only respond here for the cron path.
    if (!res.writableEnded) res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const cutoff = expiredCutoff();
  const expired = await prisma.fqdEvent.findMany({
    where: expiredEventsWhere(cutoff),
    include: { images: { orderBy: { order: "asc" } } },
  });

  const results: { title: string; emailed: boolean; imagesRemoved: number }[] =
    [];

  for (const row of expired) {
    const event = serializeFqdEvent(row);

    // 1) Email the details before anything is destroyed.
    let emailed = false;
    try {
      await resend.emails.send({
        from: FROM,
        to: [TO],
        subject: `Event expired & removed: ${event.title}`,
        react: EventExpiredEmail({ event }),
      });
      emailed = true;
    } catch (err) {
      console.error(`[expire-events] email failed for ${event.title}:`, err);
    }

    // 2) Delete images from Cloudinary (best-effort per image).
    let imagesRemoved = 0;
    for (const img of row.images) {
      if (!img.cloudinaryId) continue;
      try {
        await cloudinary.uploader.destroy(img.cloudinaryId);
        imagesRemoved += 1;
      } catch (err) {
        console.error(
          `[expire-events] Cloudinary delete failed for ${img.cloudinaryId}:`,
          err,
        );
      }
    }

    // 3) Remove from the database (image rows cascade).
    await prisma.fqdEvent.delete({ where: { id: row.id } });

    results.push({ title: event.title, emailed, imagesRemoved });
  }

  return res.status(200).json({ expired: results.length, results });
}
