import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { revalidateProjects } from "@/features/portfolio/lib/revalidate-projects";

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
    await revalidateProjects(res, item);
    return res.json(item);
  }

  // Partial update — used by the admin list to toggle the "Latest Work" flag
  // (isRecent), and by the product-shots screen to persist the image JSON.
  if (req.method === "PATCH") {
    const { isRecent, image } = req.body as {
      isRecent?: boolean;
      image?: unknown;
    };
    const data: { isRecent?: boolean; image?: unknown } = {};
    if (typeof isRecent === "boolean") data.isRecent = isRecent;
    if (image !== undefined) data.image = image;

    const item = await prisma.project.update({
      where: { id },
      data: data as never,
    });
    await revalidateProjects(res, item);
    return res.json(item);
  }

  if (req.method === "DELETE") {
    const item = await prisma.project.delete({ where: { id } });
    await revalidateProjects(res, item);
    return res.json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
