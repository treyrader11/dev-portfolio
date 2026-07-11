import type { NextApiRequest, NextApiResponse } from "next";
import mammoth from "mammoth";
import { requireAdmin } from "@/features/admin/lib/admin-auth";

export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};

// Extract raw text from an uploaded .docx (sent as base64) so it can be parsed.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { fileBase64 } = req.body as { fileBase64?: string };
  if (!fileBase64) return res.status(400).json({ error: "No file provided" });

  try {
    const buffer = Buffer.from(fileBase64, "base64");
    const { value } = await mammoth.extractRawText({ buffer });
    return res.status(200).json({ text: value });
  } catch (err) {
    return res.status(400).json({
      error: err instanceof Error ? err.message : "Could not read the .docx",
    });
  }
}
