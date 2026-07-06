import type { Project as PrismaProject } from "@prisma/client";

export type ProjectItem = Omit<PrismaProject, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export const emptyProject = {
  title: "",
  description: "",
  color: "#000000",
  isPriority: false,
  videoKey: "",
  stack: "",
  techImage: "",
  tags: [""],
  category: "",
  technologyFeature: [""],
  packages: { frontend: [] as string[], backend: [] as string[] },
  env: {
    general: [] as string[],
    frontend: [] as string[],
    backend: [] as string[],
  },
  youtubeLink: "",
  githubLink: "",
  downloadLinks: { frontend: "", backend: "", source: "", ios: "" },
  projectImage: "",
  projectVideo: "",
  image: {
    isPriority: false,
    src: "",
    icon: "",
    shots: [] as string[],
    safari: "",
  },
  websiteUrl: "",
  isRecent: false,
  sortOrder: 0,
  isSlider: false,
  sliderOrder: 0,
};
