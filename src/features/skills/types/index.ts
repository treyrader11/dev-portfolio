import type { Skill as PrismaSkill } from "@prisma/client";

export type SkillItem = Omit<PrismaSkill, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export const emptySkill = {
  skillName: "",
  imageUrl: "",
  width: 80,
  height: 80,
  category: "all",
  sortOrder: 0,
};
