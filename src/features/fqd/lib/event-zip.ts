import JSZip from "jszip";
import { eventImageFilename, pngDeliveryUrl } from "./image-filenames";
import { buildEventListingDocx } from "./event-listing-docx";
import type { FqdEventListItem } from "../types/fqd-types";

async function fetchPngBuffer(
  url: string,
  cloudinaryId?: string | null,
): Promise<Buffer | null> {
  try {
    const resp = await fetch(pngDeliveryUrl(url, cloudinaryId));
    if (!resp.ok) return null;
    return Buffer.from(await resp.arrayBuffer());
  } catch {
    return null;
  }
}

// Add one event to the zip as a folder (named `folderName`) containing its
// formatted listing .docx and every image as a PNG.
export async function addEventFolder(
  zip: JSZip,
  event: FqdEventListItem,
  folderName: string,
): Promise<void> {
  const folder = zip.folder(folderName);
  if (!folder) return;

  const docx = await buildEventListingDocx(event);
  folder.file(`${folderName}.docx`, docx);

  const total = event.images.length;
  const buffers = await Promise.all(
    event.images.map((img) => fetchPngBuffer(img.url, img.cloudinaryId)),
  );
  buffers.forEach((buffer, i) => {
    if (buffer) folder.file(eventImageFilename(event.slug, i, total), buffer);
  });
}

// Build a zip with one folder per event (named by slug), each holding the
// listing .docx + image PNGs. Slugs are unique, so folders never collide.
export async function buildEventsZip(
  events: FqdEventListItem[],
): Promise<Buffer> {
  const zip = new JSZip();
  await Promise.all(
    events.map((event) =>
      addEventFolder(
        zip,
        event,
        event.slug || `event-${event.id.slice(0, 8)}`,
      ),
    ),
  );
  return zip.generateAsync({ type: "nodebuffer" });
}
