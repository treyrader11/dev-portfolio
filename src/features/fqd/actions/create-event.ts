import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import {
  ensureUniqueSlug,
  serializeFqdEvent,
  toScalarData,
} from "../lib/serialize";
import type { FqdEventFormValues } from "../types/fqd-types";

export async function createFqdEvent(
  values: FqdEventFormValues,
  rawResearch?: unknown,
) {
  const slug = await ensureUniqueSlug(values.slug, values.title);
  const created = await prisma.fqdEvent.create({
    data: {
      ...toScalarData(values),
      slug,
      ...(rawResearch !== undefined
        ? { rawResearch: rawResearch as Prisma.InputJsonValue }
        : {}),
      images: {
        create: values.images.map((img, i) => ({
          url: img.url,
          cloudinaryId: img.cloudinaryId ?? null,
          alt: img.alt ?? null,
          order: img.order ?? i,
        })),
      },
    },
    include: { images: { orderBy: { order: "asc" } } },
  });
  return serializeFqdEvent(created);
}
