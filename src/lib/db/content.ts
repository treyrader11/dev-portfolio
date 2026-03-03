import { prisma } from "@/lib/prisma";
import {
  userData as fallbackUserData,
  experiences as fallbackExperiences,
  projectsData as fallbackProjects,
  skills as fallbackSkills,
  references as fallbackReferences,
  metaDescriptions as fallbackMeta,
  ctaTexts as fallbackCta,
  tagColors as fallbackTagColors,
} from "@/lib/data";
import type {
  UserData,
  ProjectData,
  Skill,
  MetaDescriptions,
  CtaTexts,
  TagColors,
} from "@/types/data";

export async function getUserData(): Promise<UserData> {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { key: "userData" },
    });
    if (config?.value) return config.value as unknown as UserData;
  } catch (e) {
    console.error("Failed to fetch userData from DB:", e);
  }
  return fallbackUserData;
}

export async function getExperiences() {
  try {
    const items = await prisma.experience.findMany({
      orderBy: { sortOrder: "asc" },
    });
    if (items.length > 0) {
      return items.map((exp) => ({
        title: exp.title,
        company_name: exp.company,
        icon: exp.iconUrl,
        iconBg: exp.iconBg,
        date: exp.date,
        website_url: exp.websiteUrl,
        points: exp.points,
      }));
    }
  } catch (e) {
    console.error("Failed to fetch experiences from DB:", e);
  }
  return fallbackExperiences;
}

export async function getProjects(): Promise<ProjectData[]> {
  try {
    const items = await prisma.project.findMany({
      orderBy: { sortOrder: "asc" },
    });
    if (items.length > 0) {
      return items.map((p) => ({
        title: p.title,
        desc: p.description,
        color: p.color,
        isPriority: p.isPriority,
        video_key: p.videoKey,
        stack: p.stack,
        tech_image: p.techImage,
        tags: p.tags,
        category: p.category,
        technology_feature: p.technologyFeature,
        packages: (p.packages as ProjectData["packages"]) ?? {},
        env: (p.env as ProjectData["env"]) ?? {},
        youtube_link: p.youtubeLink,
        github_link: p.githubLink,
        download_links: (p.downloadLinks as ProjectData["download_links"]) ?? {},
        project_image: p.projectImage,
        project_video: p.projectVideo,
        image: p.image as unknown as ProjectData["image"],
        website_url: p.websiteUrl,
        isRecent: p.isRecent,
      }));
    }
  } catch (e) {
    console.error("Failed to fetch projects from DB:", e);
  }
  return fallbackProjects;
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const items = await prisma.skill.findMany({
      orderBy: { sortOrder: "asc" },
    });
    if (items.length > 0) {
      return items.map((s) => ({
        skill_name: s.skillName,
        Image: s.imageUrl,
        width: s.width,
        height: s.height,
      }));
    }
  } catch (e) {
    console.error("Failed to fetch skills from DB:", e);
  }
  return fallbackSkills;
}

export async function getReferences() {
  try {
    const items = await prisma.reference.findMany({
      orderBy: { sortOrder: "asc" },
    });
    if (items.length > 0) {
      return items.map((r) => ({
        name: r.name,
        role: r.role,
        company: r.company ?? "",
        image: r.imageUrl,
        text: r.text,
      }));
    }
  } catch (e) {
    console.error("Failed to fetch references from DB:", e);
  }
  return fallbackReferences;
}

export async function getMetaDescriptions(): Promise<MetaDescriptions> {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { key: "metaDescriptions" },
    });
    if (config?.value) return config.value as unknown as MetaDescriptions;
  } catch (e) {
    console.error("Failed to fetch metaDescriptions from DB:", e);
  }
  return fallbackMeta;
}

export async function getCtaTexts(): Promise<CtaTexts> {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { key: "ctaTexts" },
    });
    if (config?.value) return config.value as unknown as CtaTexts;
  } catch (e) {
    console.error("Failed to fetch ctaTexts from DB:", e);
  }
  return fallbackCta;
}

export async function getTagColors(): Promise<TagColors> {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { key: "tagColors" },
    });
    if (config?.value) return config.value as unknown as TagColors;
  } catch (e) {
    console.error("Failed to fetch tagColors from DB:", e);
  }
  return fallbackTagColors;
}
