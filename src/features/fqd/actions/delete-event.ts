import { prisma } from "@/lib/prisma";

// Deletes the event; images cascade-delete via the FK. Returns the deleted
// event's images so the caller can also remove them from Cloudinary if desired.
export async function deleteFqdEvent(id: string) {
  const images = await prisma.fqdEventImage.findMany({
    where: { eventId: id },
    select: { cloudinaryId: true },
  });
  await prisma.fqdEvent.delete({ where: { id } });
  return { cloudinaryIds: images.map((i) => i.cloudinaryId).filter(Boolean) };
}
