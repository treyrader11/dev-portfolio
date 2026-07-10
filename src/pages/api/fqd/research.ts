import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { researchByQuery } from "@/features/fqd/lib/research";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body as { query?: string };
  if (!query?.trim()) {
    return res.status(400).json({ error: "A search query is required" });
  }

  try {
    const { fields, raw } = await researchByQuery(query.trim());
    return res.status(200).json({ fields, raw });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Research failed";
    return res.status(502).json({ error: message });
  }
}
