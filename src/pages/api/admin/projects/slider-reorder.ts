import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { revalidateProjects } from "@/features/portfolio/lib/revalidate-projects";

// Persist a new ordering for the home page's sliding-images strip: each id's
// array position becomes its sliderOrder. Sent by the admin "Sliding Images"
// reorderable section after a drag completes. Kept separate from sortOrder so
// the slider order is independent of the Latest Work order. Revalidates the
// static surfaces afterward.
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
      prisma.project.update({ where: { id }, data: { sliderOrder: index } }),
    ),
  );

  await revalidateProjects(res);
  return res.status(200).json({ success: true });
}
