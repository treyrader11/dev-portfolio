import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import { generateText } from "ai";
import { getModel, getFirstAvailableModel } from "@/lib/ai/providers";
import type { AIProviderName } from "@/lib/ai/providers";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!(await requireAdmin(req, res))) return;

  const { pdfBase64, provider } = req.body;

  if (!pdfBase64 || typeof pdfBase64 !== "string") {
    return res.status(400).json({ error: "pdfBase64 is required" });
  }

  try {
    // Parse PDF to extract text (pdf-parse v1 uses CommonJS)
    const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>; // eslint-disable-line
    const buffer = Buffer.from(pdfBase64, "base64");
    const pdfData = await pdfParse(buffer);
    const pdfText = pdfData.text;

    if (!pdfText.trim()) {
      return res.status(400).json({ error: "Could not extract text from PDF" });
    }

    // Use AI to parse the extracted text into invoice structure
    const model = provider
      ? getModel(provider as AIProviderName)
      : getFirstAvailableModel();

    const { text: result } = await generateText({
      model,
      system: `You are an invoice parser. Extract structured invoice data from the provided text.
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
- For line items, determine if each is hourly (has hours/time) or fixed (flat fee).
- If you can't determine a field, use null or 0 as appropriate.
- Parse amounts, rates, and quantities as numbers.
- Extract tax rate as a percentage number (e.g., 8.25 for 8.25%).`,
      prompt: `Parse this invoice text into structured data:\n\n${pdfText}`,
      temperature: 0.1,
      maxOutputTokens: 4000,
    });

    // Parse the AI response as JSON
    const cleaned = result.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return res.json({ invoice: parsed, rawText: pdfText });
  } catch (e) {
    return res.status(500).json({ error: (e as Error).message });
  }
}
