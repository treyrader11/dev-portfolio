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
      recipientEmails?: unknown;
    };
    const recipientEmails = Array.isArray(body.recipientEmails)
      ? Array.from(
          new Set(
            body.recipientEmails
              .filter((e): e is string => typeof e === "string")
              .map((e) => e.trim())
              .filter(Boolean),
          ),
        )
      : [];
    const saved = await saveFqdNotificationSettings({
      emailOnStart: body.emailOnStart ?? true,
      emailOnEnd: body.emailOnEnd ?? true,
      recipientEmails,
    });
    return res.status(200).json(saved);
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  return res.status(405).json({ error: "Method not allowed" });
}
