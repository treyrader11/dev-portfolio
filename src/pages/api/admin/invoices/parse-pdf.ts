import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
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

  const { pdfBase64, provider, autoSave } = req.body;

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
      system: `You are an invoice parser that extracts structured data from invoice text.
Return ONLY a valid JSON object (no markdown, no code fences) with this exact structure:
{
  "clientName": "string (the company or person being billed, e.g. 'Evolve Media AI')",
  "clientEmail": "string or null",
  "clientAddress": "string or null",
  "fromName": "string (the person who created the invoice)",
  "fromPhone": "string or null (phone number of the invoice creator)",
  "invoiceDate": "YYYY-MM-DD (the invoice date)",
  "periodStart": "YYYY-MM-DD or null (start of the billing/work period)",
  "periodEnd": "YYYY-MM-DD or null (end of the billing/work period)",
  "hourlyRate": number or null (e.g. 25.00),
  "totalHours": number or null (e.g. 80),
  "taxRate": number (percentage, e.g. 8.25 for 8.25%, or 0 if none),
  "workSummary": ["string array of work completed bullet points"] or [],
  "notes": "string or null",
  "dailyEntries": [
    {
      "date": "YYYY-MM-DD",
      "dayOfWeek": "Monday",
      "description": "string (e.g. 'Dev Standup + Tickets')",
      "hours": number (e.g. 8, or 0 if no work that day)
    }
  ]
}

IMPORTANT RULES:
- "dailyEntries" should contain EVERY day listed in the invoice, including days with 0 hours (weekends, days off marked with "—").
- For days with no work (marked "—" or empty), set hours to 0 and description to "—".
- "clientName" is the company/organization name shown on the invoice (NOT the person who created it).
- "fromName" is the person who created/sent the invoice (the one billing).
- Extract the hourly rate and total hours if shown.
- "workSummary" should be an array of bullet point strings describing work completed.
- Parse all dates as YYYY-MM-DD format.
- Parse all numbers as plain numbers (no currency symbols, no commas).`,
      prompt: `Parse this invoice text into structured data:\n\n${pdfText}`,
      temperature: 0.1,
      maxOutputTokens: 8000,
    });

    // Parse the AI response as JSON
    const cleaned = result.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    // Auto-save to database if requested
    if (autoSave) {
      const rate = parsed.hourlyRate || 0;
      const tRate = parsed.taxRate || 0;

      // Build line items from daily entries
      const lineItems = (parsed.dailyEntries || []).map(
        (
          entry: {
            date: string;
            dayOfWeek: string;
            description: string;
            hours: number;
          },
          i: number
        ) => ({
          description: entry.description || "—",
          type: "hourly",
          quantity: entry.hours || 0,
          rate: rate,
          amount: Math.round((entry.hours || 0) * rate * 100) / 100,
          date: entry.date ? new Date(entry.date) : null,
          dayOfWeek: entry.dayOfWeek || null,
          sortOrder: i,
        })
      );

      // Filter to only entries with hours > 0 for subtotal calculation
      const billableItems = lineItems.filter(
        (li: { quantity: number }) => li.quantity > 0
      );
      const subtotal = billableItems.reduce(
        (sum: number, item: { amount: number }) => sum + item.amount,
        0
      );
      const taxAmount = Math.round(subtotal * (tRate / 100) * 100) / 100;
      const total = Math.round((subtotal + taxAmount) * 100) / 100;

      // Generate invoice number
      const year = new Date().getFullYear();
      const count = await prisma.invoice.count({
        where: { invoiceNumber: { startsWith: `INV-${year}` } },
      });
      const invoiceNumber = `INV-${year}-${String(count + 1).padStart(3, "0")}`;

      // Get "from" info - use parsed data or defaults
      let fromName = parsed.fromName || "Trey Rader";
      let fromEmail: string | null = null;
      let fromAddress: string | null = null;
      try {
        const userData = await prisma.siteConfig.findUnique({
          where: { key: "userData" },
        });
        if (userData?.value) {
          const data = userData.value as Record<string, unknown>;
          if (!parsed.fromName && data.name) fromName = data.name as string;
          if (data.email) fromEmail = data.email as string;
        }
      } catch {
        // use defaults
      }

      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber,
          date: parsed.invoiceDate ? new Date(parsed.invoiceDate) : new Date(),
          periodStart: parsed.periodStart
            ? new Date(parsed.periodStart)
            : null,
          periodEnd: parsed.periodEnd ? new Date(parsed.periodEnd) : null,
          status: "draft",
          clientName: parsed.clientName || "Unknown Client",
          clientEmail: parsed.clientEmail || null,
          clientAddress: parsed.clientAddress || null,
          fromName,
          fromEmail,
          fromAddress,
          fromPhone: parsed.fromPhone || null,
          subtotal,
          taxRate: tRate,
          taxAmount,
          total,
          hourlyRate: parsed.hourlyRate || null,
          totalHours: parsed.totalHours || null,
          notes: parsed.notes || null,
          workSummary: parsed.workSummary || [],
          lineItems: {
            create: lineItems,
          },
        },
        include: { lineItems: { orderBy: { sortOrder: "asc" } } },
      });

      return res.json({ invoice: parsed, saved: invoice, rawText: pdfText });
    }

    return res.json({ invoice: parsed, rawText: pdfText });
  } catch (e) {
    return res.status(500).json({ error: (e as Error).message });
  }
}
