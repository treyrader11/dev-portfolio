import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import {
  generateSubcategoryWithFallback,
  FqdAllProvidersError,
} from "@/features/fqd/lib/fqd-research";

export const config = { maxDuration: 30 };

// Generate a concise subcategory label from an event's description via the AI
// provider fallback chain.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { description, title, category } = req.body as {
    description?: string;
    title?: string;
    category?: string;
  };
  if (!description?.trim()) {
    return res
      .status(400)
      .json({ error: "A description is required to generate a subcategory" });
  }

  try {
    const { subcategory, provider } = await generateSubcategoryWithFallback({
      description,
      title,
      category,
    });
    return res.status(200).json({ subcategory, provider });
  } catch (err) {
    if (err instanceof FqdAllProvidersError) {
      return res
        .status(502)
        .json({ error: "AI providers unavailable", attempts: err.attempts });
    }
    return res.status(500).json({ error: "Couldn't generate a subcategory" });
  }
}
