import { prisma } from "@/lib/prisma";
import { serializeFqdEvent } from "../lib/serialize";
import type { FqdStatus } from "../types/fqd-types";

// Set an event's manual workflow status (draft → researched → approved →
// exported). Returns the serialized event so the client can update in place.
export async function setFqdEventStatus(id: string, status: FqdStatus) {
  const row = await prisma.fqdEvent.update({
    where: { id },
    data: { status },
    include: { images: { orderBy: { order: "asc" } } },
  });
  return serializeFqdEvent(row);
}
