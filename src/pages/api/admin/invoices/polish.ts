import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import { generateText } from "ai";
import { getFirstAvailableModel } from "@/lib/ai/providers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!(await requireAdmin(req, res))) return;

  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "text is required" });
  }

  try {
    const model = getFirstAvailableModel();
    const { text: polished } = await generateText({
      model,
      system:
        "You are a text editor. Fix grammar, punctuation, and speech-to-text errors. Make it clear and concise. Preserve the user's exact intent. Return ONLY the polished text, nothing else.",
      prompt: text,
      temperature: 0.1,
      maxOutputTokens: 500,
    });

    return res.json({ polished: polished.trim() });
  } catch (e) {
    return res.status(500).json({ error: (e as Error).message });
  }
}
