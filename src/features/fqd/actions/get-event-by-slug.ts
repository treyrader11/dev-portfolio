import { prisma } from "@/lib/prisma";
import { serializeFqdEvent } from "../lib/serialize";
import type { FqdEventListItem } from "../types/fqd-types";

export async function getFqdEventBySlug(
  slug: string,
): Promise<FqdEventListItem | null> {
  const row = await prisma.fqdEvent.findUnique({
    where: { slug },
    include: { images: { orderBy: { order: "asc" } } },
  });
  return row ? serializeFqdEvent(row) : null;
}
