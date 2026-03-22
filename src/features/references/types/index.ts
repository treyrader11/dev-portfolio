import type { Reference as PrismaReference } from "@prisma/client";

export type ReferenceItem = Omit<PrismaReference, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export const emptyReference = {
  name: "",
  role: "",
  company: "",
  imageUrl: "",
  text: "",
  sortOrder: 0,
};
