import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import {
  generateClassificationsWithFallback,
  aiErrorResponse,
} from "@/features/fqd/lib/fqd-research";
import { parseFqdProvider } from "@/features/fqd/types/fqd-types";

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

  const {
    field,
    description,
    title,
    category,
    provider: sel,
  } = req.body as {
    field?: "category" | "subcategory";
    description?: string;
    title?: string;
    category?: string;
    provider?: string;
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
      parseFqdProvider(sel),
    );
    return res.status(200).json({ values, provider });
  } catch (err) {
    const { status, body } = aiErrorResponse(err, `Couldn't generate a ${field}`);
    return res.status(status).json(body);
  }
}
