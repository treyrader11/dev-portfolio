import { prisma } from "@/lib/prisma";
import type {
  ProjectData,
  ProjectImage,
  ProjectPackages,
  ProjectEnv,
  ProjectDownloadLinks,
} from "@/types/data";
import type { Project } from "@prisma/client";

// Adapter: Prisma model (camelCase, Json fields) -> the snake_case ProjectData
// shape the public components already consume. Keeps rendering code untouched
// while the data source moves to the database.
export function mapProjectToData(p: Project): ProjectData {
  return {
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
    packages: (p.packages as unknown as ProjectPackages | null) ?? {},
    env: (p.env as unknown as ProjectEnv | null) ?? {},
    youtube_link: p.youtubeLink,
    github_link: p.githubLink,
    download_links:
      (p.downloadLinks as unknown as ProjectDownloadLinks | null) ?? {},
    project_image: p.projectImage,
    project_video: p.projectVideo,
    image: (p.image as unknown as ProjectImage | null) ?? {
      src: p.projectImage,
    },
    website_url: p.websiteUrl,
    isRecent: p.isRecent,
  };
}

export async function getAllProjects(): Promise<ProjectData[]> {
  try {
    const items = await prisma.project.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return items.map(mapProjectToData);
  } catch {
    // DB unreachable at build time — ISR will backfill on the next revalidate.
    return [];
  }
}

export async function getRecentProjects(): Promise<ProjectData[]> {
  try {
    const items = await prisma.project.findMany({
      where: { isRecent: true },
      orderBy: { sortOrder: "asc" },
    });
    return items.map(mapProjectToData);
  } catch {
    return [];
  }
}

export async function getProjectVideoKeys(): Promise<string[]> {
  try {
    const items = await prisma.project.findMany({ select: { videoKey: true } });
    return items.map((i) => i.videoKey);
  } catch {
    return [];
  }
}

export async function getProjectByVideoKey(
  videoKey: string,
): Promise<ProjectData | null> {
  try {
    const item = await prisma.project.findFirst({ where: { videoKey } });
    return item ? mapProjectToData(item) : null;
  } catch {
    return null;
  }
}
