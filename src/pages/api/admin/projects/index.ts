import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/admin/lib/admin-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!(await requireAdmin(req, res))) return;

  if (req.method === "GET") {
    const items = await prisma.project.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return res.json(items);
  }

  if (req.method === "POST") {
    const {
      title, description, color, isPriority, videoKey, stack, techImage,
      tags, category, technologyFeature, packages, env, youtubeLink,
      githubLink, downloadLinks, projectImage, projectVideo, image,
      websiteUrl, isRecent, sortOrder,
    } = req.body;

    const item = await prisma.project.create({
      data: {
        title, description, color, isPriority: isPriority ?? false,
        videoKey, stack, techImage, tags, category, technologyFeature,
        packages, env, youtubeLink, githubLink, downloadLinks,
        projectImage, projectVideo, image, websiteUrl,
        isRecent: isRecent ?? false, sortOrder: sortOrder ?? 0,
      },
    });
    return res.status(201).json(item);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
