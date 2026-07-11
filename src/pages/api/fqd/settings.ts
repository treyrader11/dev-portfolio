import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import {
  getFqdNotificationSettings,
  saveFqdNotificationSettings,
} from "@/features/fqd/lib/notification-settings";

// Read (GET) / update (PUT) the FQD notification settings.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;

  if (req.method === "GET") {
    return res.status(200).json(await getFqdNotificationSettings());
  }

  if (req.method === "PUT") {
    const body = req.body as {
      emailOnStart?: boolean;
      emailOnEnd?: boolean;
      recipientEmail?: string;
    };
    const saved = await saveFqdNotificationSettings({
      emailOnStart: body.emailOnStart ?? true,
      emailOnEnd: body.emailOnEnd ?? true,
      recipientEmail:
        typeof body.recipientEmail === "string"
          ? body.recipientEmail.trim()
          : "",
    });
    return res.status(200).json(saved);
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  return res.status(405).json({ error: "Method not allowed" });
}
