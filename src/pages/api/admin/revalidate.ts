import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";

// Public ISR surfaces that render CMS-managed content. Kept here so the admin
// "View site" action can force a fresh regeneration on demand, regardless of
// which mutation last touched the data.
const DEFAULT_PATHS = ["/", "/portfolio"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { paths } = req.body as { paths?: string[] };
  const targets =
    Array.isArray(paths) && paths.length ? paths : DEFAULT_PATHS;

  // Regenerate each static page now. Failures (e.g. a path not yet built) are
  // non-fatal — the caller still navigates.
  await Promise.all(
    targets.map((path) => res.revalidate(path).catch(() => undefined)),
  );

  return res.status(200).json({ revalidated: targets });
}
