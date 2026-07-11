import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import {
  runStartNotifications,
  runExpiration,
} from "@/features/fqd/lib/event-notifications";

export const config = { maxDuration: 60 };

async function authorize(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<boolean> {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization === `Bearer ${secret}`) return true;
  return requireAdmin(req, res);
}

// Scheduled cron entry point: send "event starting" emails for events whose
// start time has arrived, then expire (email + remove) events past their end
// date. Both passes respect the admin notification settings and are idempotent.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await authorize(req, res))) {
    if (!res.writableEnded) res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const started = await runStartNotifications();
  const expired = await runExpiration();
  return res.status(200).json({ started, expired });
}
