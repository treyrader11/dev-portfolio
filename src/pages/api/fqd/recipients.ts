import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import {
  getFqdRecipients,
  addFqdRecipient,
  removeFqdRecipient,
} from "@/features/fqd/lib/fqd-recipients";

// Manage the common email recipient list (stored in SiteConfig).
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;

  if (req.method === "GET") {
    const recipients = await getFqdRecipients();
    return res.status(200).json({ recipients });
  }

  if (req.method === "POST") {
    const { email } = req.body as { email?: string };
    if (!email?.trim()) {
      return res.status(400).json({ error: "An email is required" });
    }
    try {
      const recipients = await addFqdRecipient(email);
      return res.status(201).json({ recipients });
    } catch (err) {
      return res.status(400).json({
        error: err instanceof Error ? err.message : "Couldn't add recipient",
      });
    }
  }

  if (req.method === "DELETE") {
    const { email } = req.body as { email?: string };
    if (!email?.trim()) {
      return res.status(400).json({ error: "An email is required" });
    }
    const recipients = await removeFqdRecipient(email);
    return res.status(200).json({ recipients });
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).json({ error: "Method not allowed" });
}
