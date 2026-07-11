import { cloudinary } from "@/lib/cloudinary";
import { deleteFqdEvent } from "../actions/delete-event";

// Delete an event and remove its images from Cloudinary. Cloudinary failures are
// logged but never block the DB delete — the row is gone regardless.
export async function deleteFqdEventWithImages(id: string) {
  const { cloudinaryIds } = await deleteFqdEvent(id);
  await Promise.all(
    cloudinaryIds.map(async (publicId) => {
      if (!publicId) return;
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error(`[fqd] Cloudinary destroy failed for ${publicId}:`, err);
      }
    }),
  );
}
