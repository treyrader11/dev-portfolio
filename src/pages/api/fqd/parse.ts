import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { parseFromText } from "@/features/fqd/lib/research";

export const config = {
  api: { bodyParser: { sizeLimit: "1mb" } },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body as { text?: string };
  if (!text?.trim()) {
    return res.status(400).json({ error: "No text provided to parse" });
  }

  try {
    const { fields, raw } = await parseFromText(text.trim());
    return res.status(200).json({ fields, raw });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Parse failed";
    return res.status(502).json({ error: message });
  }
}
