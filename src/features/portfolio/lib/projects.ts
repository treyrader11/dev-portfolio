import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
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

export async function getLatestWorkProjects(): Promise<ProjectData[]> {
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

// The home page sliding-images strip: a project's poster + its brand color,
// only for projects flagged as slider images, in their sliderOrder.
export type SliderProject = {
  title: string;
  poster: string;
  color: string;
  isPriority: boolean;
};

export async function getSliderProjects(): Promise<SliderProject[]> {
  try {
    const items = await prisma.project.findMany({
      where: { isSlider: true },
      orderBy: { sliderOrder: "asc" },
      select: {
        title: true,
        projectImage: true,
        color: true,
        isPriority: true,
        image: true,
      },
    });
    return items.map((p) => {
      const img = (
        p.image && typeof p.image === "object" ? p.image : {}
      ) as { src?: string };
      return {
        title: p.title,
        poster: p.projectImage || img.src || "",
        color: p.color,
        isPriority: p.isPriority,
      };
    });
  } catch {
    return [];
  }
}

export async function getProjectVideoKeys(): Promise<string[]> {
  try {
    const items = await prisma.project.findMany({ select: { videoKey: true } });
    // Drop empty keys — an empty videoKey would generate the path "/project",
    // which doesn't match the /project/[projectId] route and breaks the build.
    return items.map((i) => i.videoKey).filter(Boolean);
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

// Readable URL slug for the public project page, e.g. "Vouzot" -> "vouzot".
// Mirrors the admin route convention (/admin/projects/<slug>).
export async function getProjectSlugs(): Promise<string[]> {
  try {
    const items = await prisma.project.findMany({ select: { title: true } });
    return items.map((i) => slugify(i.title)).filter(Boolean);
  } catch {
    return [];
  }
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectData | null> {
  try {
    const items = await prisma.project.findMany();
    const match = items.find((p) => slugify(p.title) === slug);
    return match ? mapProjectToData(match) : null;
  } catch {
    return null;
  }
}
