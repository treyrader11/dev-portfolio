import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { serializeFqdEvent } from "./serialize";
import { expiredCutoff, expiredEventsWhere } from "./expiry";
import { eventStartAt } from "./event-start-at";
import {
  getFqdNotificationSettings,
  resolveRecipient,
} from "./notification-settings";
import { EventStartedEmail } from "../emails/event-started";
import { EventExpiredEmail } from "../emails/event-expired";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM =
  process.env.RESEND_AUTOREPLY_FROM_EMAIL ||
  "Trey Rader <noreply@treyrader.dev>";

// Public site origin (for absolute links in emails).
function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_ENV === "production" &&
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://treyrader.dev")
  );
}

const eventsDashboardUrl = () =>
  `${siteUrl()}/admin/french-quarter-direct/events`;
const eventDetailUrl = (slug: string) =>
  `${siteUrl()}/admin/french-quarter-direct/event/${slug}`;

// Email the recipient once per event, at (or after) its start time. Idempotent
// via FqdEvent.startNotifiedAt.
export async function runStartNotifications(now: Date = new Date()) {
  const settings = await getFqdNotificationSettings();
  if (!settings.emailOnStart) return { sent: 0, disabled: true };

  const to = resolveRecipient(settings);
  const candidates = await prisma.fqdEvent.findMany({
    where: {
      startNotifiedAt: null,
      NOT: expiredEventsWhere(expiredCutoff(now)),
    },
    include: { images: { orderBy: { order: "asc" } } },
  });

  let sent = 0;
  for (const row of candidates) {
    if (eventStartAt(row.startDate, row.startTime) > now) continue; // not yet
    const event = serializeFqdEvent(row);
    try {
      await resend.emails.send({
        from: FROM,
        to: [to],
        subject: `Event starting: ${event.title}`,
        react: EventStartedEmail({
          event,
          adminUrl: eventDetailUrl(event.slug),
        }),
      });
      await prisma.fqdEvent.update({
        where: { id: row.id },
        data: { startNotifiedAt: now },
      });
      sent += 1;
    } catch (err) {
      console.error(`[fqd] start email failed for ${event.title}:`, err);
    }
  }
  return { sent };
}

// Find every event past its end date, email the details (when enabled), delete
// its Cloudinary images, then remove it from the database. Idempotent.
export async function runExpiration(now: Date = new Date()) {
  const settings = await getFqdNotificationSettings();
  const to = resolveRecipient(settings);

  const cutoff = expiredCutoff(now);
  const expired = await prisma.fqdEvent.findMany({
    where: expiredEventsWhere(cutoff),
    include: { images: { orderBy: { order: "asc" } } },
  });

  const results: { title: string; emailed: boolean; imagesRemoved: number }[] =
    [];

  for (const row of expired) {
    const event = serializeFqdEvent(row);

    // 1) Email the details before anything is destroyed (when enabled).
    let emailed = false;
    if (settings.emailOnEnd) {
      try {
        await resend.emails.send({
          from: FROM,
          to: [to],
          subject: `Event expired & removed: ${event.title}`,
          react: EventExpiredEmail({ event, adminUrl: eventsDashboardUrl() }),
        });
        emailed = true;
      } catch (err) {
        console.error(`[fqd] expire email failed for ${event.title}:`, err);
      }
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
          `[fqd] Cloudinary delete failed for ${img.cloudinaryId}:`,
          err,
        );
      }
    }

    // 3) Remove from the database (image rows cascade).
    await prisma.fqdEvent.delete({ where: { id: row.id } });

    results.push({ title: event.title, emailed, imagesRemoved });
  }

  return { expired: results.length, results };
}
