import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/admin/lib/admin-auth";

// The statically generated (ISR) pages that read each config key, so a save can
// re-render them on demand instead of waiting out the time-based revalidate.
const REVALIDATE_PATHS: Record<string, string[]> = {
  // Hero phrase on home, description + Contact/Job on /info, GitHub username on
  // the portfolio.
  userData: ["/", "/info", "/portfolio"],
  githubRepos: ["/portfolio"],
};

// Re-render the pages that depend on this config key. Best-effort: a path that
// hasn't been generated yet (or any error) is ignored — ISR still catches up.
async function revalidateForKey(res: NextApiResponse, key: string) {
  const paths = REVALIDATE_PATHS[key];
  if (!paths) return;
  await Promise.all(
    paths.map((path) => res.revalidate(path).catch(() => undefined)),
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!(await requireAdmin(req, res))) return;

  const key = req.query.key as string;

  if (req.method === "GET") {
    const config = await prisma.siteConfig.findUnique({ where: { key } });
    if (!config) return res.status(404).json({ error: "Not found" });
    return res.json(config);
  }

  if (req.method === "PUT") {
    const { value } = req.body;
    const config = await prisma.siteConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    await revalidateForKey(res, key);
    return res.json(config);
  }

  // Reset to defaults: remove the saved override so the app falls back to the
  // bundled/static values. deleteMany so it's a no-op when nothing is saved.
  if (req.method === "DELETE") {
    await prisma.siteConfig.deleteMany({ where: { key } });
    await revalidateForKey(res, key);
    return res.json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
