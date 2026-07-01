import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { revalidateProjects } from "@/features/portfolio/lib/revalidate-projects";

// Persist a new project ordering: each id's array position becomes its
// sortOrder. Sent by the admin reorderable list after a drag completes. The
// public "Latest Work" section renders recent projects in this same order, so
// we revalidate the static surfaces afterward.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;

  if (req.method !== "PATCH") {
    res.setHeader("Allow", ["PATCH"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { ids } = req.body as { ids?: string[] };
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
    return res.status(400).json({ error: "ids must be an array of strings" });
  }

  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.project.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );

  await revalidateProjects(res);
  return res.status(200).json({ success: true });
}
