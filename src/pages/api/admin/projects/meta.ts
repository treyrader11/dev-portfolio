import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/admin/lib/admin-auth";

// Distinct tag + technology-feature values across all projects, with usage
// counts, so the project editor can suggest existing values (mirroring
// roux-ui's tag suggestions and category picker).
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const projects = await prisma.project.findMany({
    select: { tags: true, technologyFeature: true },
  });

  const tally = (lists: string[][]) => {
    const counts = new Map<string, number>();
    for (const list of lists) {
      for (const raw of list) {
        const value = raw.trim();
        if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([value, count]) => ({ value, count }));
  };

  return res.status(200).json({
    tags: tally(projects.map((p) => p.tags)),
    features: tally(projects.map((p) => p.technologyFeature)),
  });
}
