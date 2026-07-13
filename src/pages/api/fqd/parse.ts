import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import {
  parseEventWithFallback,
  PROVIDER_META,
  aiErrorResponse,
} from "@/features/fqd/lib/fqd-research";
import { parseFqdProvider } from "@/features/fqd/types/fqd-types";

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

  const { text, provider: sel } = req.body as {
    text?: string;
    provider?: string;
  };
  if (!text?.trim()) {
    return res.status(400).json({ error: "No text provided to parse" });
  }

  try {
    const { data, provider, raw } = await parseEventWithFallback(
      text.trim(),
      parseFqdProvider(sel),
    );
    const meta = PROVIDER_META[provider];
    return res.status(200).json({
      data,
      provider,
      providerLabel: meta.providerLabel,
      // No web search on the parse path — the text is supplied directly.
      searchEngine: "Text parse (no web search)",
      raw,
    });
  } catch (err) {
    const { status, body } = aiErrorResponse(err, "Parse failed");
    return res.status(status).json(body);
  }
}
