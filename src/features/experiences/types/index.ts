import type { Experience as PrismaExperience } from "@prisma/client";

export type ExperienceItem = Omit<PrismaExperience, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export const emptyExperience = {
  title: "",
  company: "",
  iconUrl: "",
  iconBg: "#ffffff",
  date: "",
  websiteUrl: "",
  points: [""],
  sortOrder: 0,
};
