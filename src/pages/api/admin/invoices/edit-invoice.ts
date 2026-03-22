import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { generateText } from "ai";
import { getModel, getFirstAvailableModel } from "@/lib/ai/providers";
import type { AIProviderName } from "@/lib/ai/providers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!(await requireAdmin(req, res))) return;

  const { prompt, provider, invoice } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "prompt is required" });
  }
  if (!invoice) {
    return res.status(400).json({ error: "invoice data is required" });
  }

  try {
    const model = provider
      ? getModel(provider as AIProviderName)
      : getFirstAvailableModel();

    const { text: result } = await generateText({
      model,
      system: `You are an invoice editor. You will receive existing invoice data and edit instructions.
Apply the requested changes and return the COMPLETE updated invoice as a JSON object.
Return ONLY a valid JSON object with this exact structure (no markdown, no code fences):
{
  "clientName": "string",
  "clientEmail": "string or null",
  "clientAddress": "string or null",
  "dueDate": "YYYY-MM-DD or null",
  "taxRate": number,
  "notes": "string or null",
  "lineItems": [
    {
      "description": "string",
      "type": "hourly" or "fixed",
      "quantity": number,
      "rate": number
    }
  ]
}
- Preserve all existing data unless the edit instructions specifically ask to change it.
- Only modify what the user asks to change.
- Parse amounts, rates, and quantities as numbers.`,
      prompt: `Current invoice data:
${JSON.stringify(invoice, null, 2)}

Edit instructions: ${prompt}`,
      temperature: 0.3,
      maxOutputTokens: 4000,
    });

    const cleaned = result.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return res.json({ invoice: parsed });
  } catch (e) {
    return res.status(500).json({ error: (e as Error).message });
  }
}
