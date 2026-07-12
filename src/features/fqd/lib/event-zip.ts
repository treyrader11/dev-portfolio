import JSZip from "jszip";
import { eventImageFilename, pngDeliveryUrl } from "./image-filenames";
import { buildEventListingDocx } from "./event-listing-docx";
import type { FqdEventListItem } from "../types/fqd-types";

// Run tasks with a concurrency cap so a large export doesn't open hundreds of
// sockets at once (which can exhaust connections / memory and fail the whole
// export).
async function mapPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  );
  return results;
}

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
  const buffers = await mapPool(event.images, 4, (img) =>
    fetchPngBuffer(img.url, img.cloudinaryId),
  );
  buffers.forEach((buffer, i) => {
    if (buffer) folder.file(eventImageFilename(event.slug, i, total), buffer);
  });
}

// Assemble a zip with one folder per event (named by slug), each holding the
// listing .docx + image PNGs. Slugs are unique, so folders never collide.
// A single failing event is skipped (and recorded) rather than failing the
// whole export; events are processed with bounded concurrency. Returns the
// JSZip instance so the caller can STREAM it — an all-events export of image
// PNGs is easily 100+ MB, far too large to buffer into one response.
export async function buildEventsZip(
  events: FqdEventListItem[],
): Promise<JSZip> {
  const zip = new JSZip();
  const failures: string[] = [];

  await mapPool(events, 4, async (event) => {
    const folderName = event.slug || `event-${event.id.slice(0, 8)}`;
    try {
      await addEventFolder(zip, event, folderName);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      failures.push(`${folderName} (${event.id}): ${message}`);
      console.error(`[fqd export-zip] failed to add "${folderName}"`, err);
    }
  });

  // Surface any skipped events both in the server log and inside the zip, so a
  // partial export is never silently incomplete.
  if (failures.length) {
    console.warn(
      `[fqd export-zip] skipped ${failures.length}/${events.length} event(s):\n${failures.join(
        "\n",
      )}`,
    );
    zip.file(
      "_export-errors.txt",
      `${failures.length} event(s) could not be exported:\n\n${failures.join("\n")}\n`,
    );
  }

  return zip;
}
