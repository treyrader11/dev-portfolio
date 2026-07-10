import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import {
  ensureUniqueSlug,
  serializeFqdEvent,
  toScalarData,
} from "../lib/serialize";
import type { FqdEventFormValues } from "../types/fqd-types";

export async function updateFqdEvent(
  id: string,
  values: FqdEventFormValues,
  rawResearch?: unknown,
) {
  const slug = await ensureUniqueSlug(values.slug, values.title, id);
  const updated = await prisma.fqdEvent.update({
    where: { id },
    data: {
      ...toScalarData(values),
      slug,
      ...(rawResearch !== undefined
        ? { rawResearch: rawResearch as Prisma.InputJsonValue }
        : {}),
      // Replace the image set entirely — the client sends the full ordered list.
      images: {
        deleteMany: {},
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
  return serializeFqdEvent(updated);
}
