import { RiDeleteBinLine } from "react-icons/ri";
import { IconUploadField } from "@/features/admin/components/icon-upload-field";
import { MediaLibraryPicker } from "@/features/admin/components/media-library-picker";
import { ReorderableList } from "@/features/admin/components/reorderable-list";
import type { FqdEventImageInput } from "../types/fqd-types";

interface Props {
  images: FqdEventImageInput[];
  onChange: (images: FqdEventImageInput[]) => void;
}

// Best-effort Cloudinary public_id from a delivery URL (…/upload/v123/<id>.jpg).
function cloudinaryIdFromUrl(url: string): string | null {
  const m = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return m ? m[1] : null;
}

// Multi-image manager for an event: add via crop-upload or the shared library
// picker, reorder by drag (updates `order`), edit alt text, delete per image.
export function ImageManager({ images, onChange }: Props) {
  function addUrl(url: string) {
    if (!url || images.some((i) => i.url === url)) return;
    onChange([
      ...images,
      {
        url,
        cloudinaryId: cloudinaryIdFromUrl(url),
        alt: "",
        order: images.length,
      },
    ]);
  }

  function update(url: string, patch: Partial<FqdEventImageInput>) {
    onChange(images.map((img) => (img.url === url ? { ...img, ...patch } : img)));
  }

  function remove(url: string) {
    onChange(
      images
        .filter((img) => img.url !== url)
        .map((img, i) => ({ ...img, order: i })),
    );
  }

  function reorder(next: FqdEventImageInput[]) {
    onChange(next.map((img, i) => ({ ...img, order: i })));
  }

  return (
    <div className="space-y-4">
      <IconUploadField
        label="Add event image"
        value=""
        previewBg="#141516"
        aspect={16 / 9}
        freeCrop
        folder="fqd/events"
        onChange={addUrl}
      />
      <MediaLibraryPicker onSelect={addUrl} />

      {images.length > 0 && (
        <ReorderableList
          items={images}
          getId={(img) => img.url}
          onReorder={reorder}
          itemClassName="group"
          renderItem={(img) => (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt=""
                className="h-14 w-20 shrink-0 rounded object-cover"
              />
              {/* Interactive controls must not start a drag. */}
              <div
                data-no-drag
                className="flex min-w-0 flex-1 items-center gap-2"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <input
                  value={img.alt ?? ""}
                  onChange={(e) => update(img.url, { alt: e.target.value })}
                  placeholder="Alt text"
                  className="min-w-0 flex-1 rounded-lg border border-dark-600 bg-dark-600 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-secondary"
                />
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => remove(img.url)}
                  className="text-error transition-colors hover:text-error-600"
                >
                  <RiDeleteBinLine className="size-5" />
                </button>
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
}
