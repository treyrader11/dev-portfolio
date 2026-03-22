import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import {
  userData,
  experiences,
  projectsData,
  skills,
  metaDescriptions,
  ctaTexts,
  tagColors,
  references,
} from "@/lib/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!(await requireAdmin(req, res))) return;

  try {
    // Seed SiteConfig entries
    await Promise.all([
      prisma.siteConfig.upsert({
        where: { key: "userData" },
        update: { value: JSON.parse(JSON.stringify(userData)) },
        create: { key: "userData", value: JSON.parse(JSON.stringify(userData)) },
      }),
      prisma.siteConfig.upsert({
        where: { key: "metaDescriptions" },
        update: { value: JSON.parse(JSON.stringify(metaDescriptions)) },
        create: { key: "metaDescriptions", value: JSON.parse(JSON.stringify(metaDescriptions)) },
      }),
      prisma.siteConfig.upsert({
        where: { key: "ctaTexts" },
        update: { value: JSON.parse(JSON.stringify(ctaTexts)) },
        create: { key: "ctaTexts", value: JSON.parse(JSON.stringify(ctaTexts)) },
      }),
      prisma.siteConfig.upsert({
        where: { key: "tagColors" },
        update: { value: JSON.parse(JSON.stringify(tagColors)) },
        create: { key: "tagColors", value: JSON.parse(JSON.stringify(tagColors)) },
      }),
    ]);

    // Seed experiences
    const existingExperiences = await prisma.experience.count();
    if (existingExperiences === 0) {
      for (let i = 0; i < experiences.length; i++) {
        const exp = experiences[i];
        await prisma.experience.create({
          data: {
            title: exp.title,
            company: exp.company_name,
            iconUrl: typeof exp.icon === "string" ? exp.icon : (exp.icon as { src: string }).src,
            iconBg: exp.iconBg,
            date: exp.date,
            websiteUrl: exp.website_url,
            points: exp.points,
            sortOrder: i,
          },
        });
      }
    }

    // Seed projects
    const existingProjects = await prisma.project.count();
    if (existingProjects === 0) {
      for (let i = 0; i < projectsData.length; i++) {
        const p = projectsData[i];
        await prisma.project.create({
          data: {
            title: p.title,
            description: p.desc,
            color: p.color,
            isPriority: p.isPriority ?? false,
            videoKey: p.video_key,
            stack: p.stack,
            techImage: p.tech_image,
            tags: p.tags,
            category: p.category,
            technologyFeature: p.technology_feature,
            packages: JSON.parse(JSON.stringify(p.packages)),
            env: JSON.parse(JSON.stringify(p.env)),
            youtubeLink: p.youtube_link,
            githubLink: p.github_link,
            downloadLinks: JSON.parse(JSON.stringify(p.download_links)),
            projectImage: p.project_image,
            projectVideo: p.project_video,
            image: JSON.parse(JSON.stringify(p.image)),
            websiteUrl: p.website_url,
            isRecent: p.isRecent ?? false,
            sortOrder: i,
          },
        });
      }
    }

    // Seed skills
    const existingSkills = await prisma.skill.count();
    if (existingSkills === 0) {
      for (let i = 0; i < skills.length; i++) {
        const s = skills[i];
        await prisma.skill.create({
          data: {
            skillName: s.skill_name,
            imageUrl: s.Image,
            width: s.width,
            height: s.height,
            category: "all",
            sortOrder: i,
          },
        });
      }
    }

    // Seed references
    const existingRefs = await prisma.reference.count();
    if (existingRefs === 0) {
      for (let i = 0; i < references.length; i++) {
        const r = references[i];
        await prisma.reference.create({
          data: {
            name: r.name,
            role: r.title,
            company: null,
            imageUrl: r.image_url,
            text: r.desc,
            sortOrder: i,
          },
        });
      }
    }

    return res.json({ success: true, message: "Database seeded successfully" });
  } catch (err) {
    console.error("Seed error:", err);
    return res.status(500).json({ error: "Failed to seed database" });
  }
}
