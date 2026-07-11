import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import {
  generateClassificationsWithFallback,
  FqdAllProvidersError,
} from "@/features/fqd/lib/fqd-research";

export const config = { maxDuration: 30 };

// Generate category or subcategory labels from an event's description via the
// AI provider fallback chain.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { field, description, title, category } = req.body as {
    field?: "category" | "subcategory";
    description?: string;
    title?: string;
    category?: string;
  };
  if (field !== "category" && field !== "subcategory") {
    return res.status(400).json({ error: "Invalid field" });
  }
  if (!description?.trim()) {
    return res
      .status(400)
      .json({ error: `Add a description first to generate a ${field}` });
  }

  try {
    const { values, provider } = await generateClassificationsWithFallback(
      field,
      { description, title, category },
    );
    return res.status(200).json({ values, provider });
  } catch (err) {
    if (err instanceof FqdAllProvidersError) {
      return res
        .status(502)
        .json({ error: "AI providers unavailable", attempts: err.attempts });
    }
    return res.status(500).json({ error: `Couldn't generate a ${field}` });
  }
}
