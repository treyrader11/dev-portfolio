import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/admin/lib/admin-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!(await requireAdmin(req, res))) return;

  const id = req.query.id as string;

  if (req.method === "GET") {
    const item = await prisma.project.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: "Not found" });
    return res.json(item);
  }

  if (req.method === "PUT") {
    const {
      title, description, color, isPriority, videoKey, stack, techImage,
      tags, category, technologyFeature, packages, env, youtubeLink,
      githubLink, downloadLinks, projectImage, projectVideo, image,
      websiteUrl, isRecent, sortOrder,
    } = req.body;

    const item = await prisma.project.update({
      where: { id },
      data: {
        title, description, color, isPriority, videoKey, stack, techImage,
        tags, category, technologyFeature, packages, env, youtubeLink,
        githubLink, downloadLinks, projectImage, projectVideo, image,
        websiteUrl, isRecent, sortOrder,
      },
    });
    return res.json(item);
  }

  if (req.method === "DELETE") {
    await prisma.project.delete({ where: { id } });
    return res.json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
