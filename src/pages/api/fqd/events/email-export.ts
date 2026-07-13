import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { serializeFqdEvent } from "@/features/fqd/lib/serialize";
import { buildEventsZip } from "@/features/fqd/lib/event-zip";
import { allowedRecipientEmails } from "@/features/fqd/lib/fqd-recipients";

export const config = { maxDuration: 60 };

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM =
  process.env.RESEND_AUTOREPLY_FROM_EMAIL ||
  "Trey Rader <noreply@treyrader.dev>";

// Email a docx-only zip of the selected events (one listing .docx per event) to
// the chosen recipients. Images are omitted so the attachment stays emailable.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { emails, ids } = req.body as { emails?: string[]; ids?: string[] };
  if (!Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ error: "No recipients selected" });
  }

  // Only send to saved recipients (admins + added common recipients).
  const allowed = await allowedRecipientEmails();
  const to = Array.from(
    new Set(
      emails
        .map((e) => e.trim().toLowerCase())
        .filter((e) => allowed.has(e)),
    ),
  );
  if (to.length === 0) {
    return res.status(400).json({ error: "No valid recipients" });
  }

  const where =
    Array.isArray(ids) && ids.length ? { id: { in: ids } } : undefined;
  const rows = await prisma.fqdEvent.findMany({
    where,
    orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (rows.length === 0) {
    return res.status(404).json({ error: "No events to export" });
  }

  try {
    const zip = await buildEventsZip(rows.map(serializeFqdEvent), {
      includeImages: false,
    });
    const buffer = await zip.generateAsync({ type: "nodebuffer" });

    const count = rows.length;
    const plural = count === 1 ? "" : "s";
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject: `French Quarter Direct — ${count} event${plural} export`,
      text: `Attached is a .zip containing the listing document${plural} for ${count} event${plural} from French Quarter Direct.`,
      html: `<p>Attached is a <strong>.zip</strong> containing the listing document${plural} for <strong>${count}</strong> event${plural} from French Quarter Direct.</p>`,
      attachments: [
        { filename: "french-quarter-events.zip", content: buffer },
      ],
    });
    if (error) {
      console.error("[fqd email-export] resend error", error);
      return res.status(502).json({ error: error.message ?? "Email failed" });
    }
    return res.status(200).json({ sent: to.length, recipients: to });
  } catch (err) {
    console.error("[fqd email-export] failed", err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Email failed",
    });
  }
}
