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
  packages: { frontend: [], backend: [] },
  env: { frontend: [], backend: [] },
  youtubeLink: "",
  githubLink: "",
  downloadLinks: { frontend: "", backend: "" },
  projectImage: "",
  projectVideo: "",
  image: { isPriority: false, src: "" },
  websiteUrl: "",
  isRecent: false,
  sortOrder: 0,
};
