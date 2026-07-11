import { prisma } from "@/lib/prisma";
import { serializeFqdEvent } from "../lib/serialize";

// Toggle whether an event has been added to French Quarter Direct (Joomla).
export async function setFqdEventAdded(id: string, addedToJoomla: boolean) {
  const row = await prisma.fqdEvent.update({
    where: { id },
    data: { addedToJoomla },
    include: { images: { orderBy: { order: "asc" } } },
  });
  return serializeFqdEvent(row);
}
