"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper, { type Area } from "react-easy-crop";
import {
  RiDeleteBinLine,
  RiUploadCloud2Line,
  RiCrop2Line,
  RiLoader4Line,
} from "react-icons/ri";
import { MediaLibraryPicker } from "@/features/admin/components/media-library-picker";
import { ReorderableList } from "@/features/admin/components/reorderable-list";
import { getCroppedBlob } from "@/features/admin/lib/crop-image";
import { uploadCroppedImage } from "@/features/admin/lib/upload-cropped-image";
import { cn } from "@/lib/utils";
import type { FqdEventImageInput } from "../types/fqd-types";

const FOLDER = "fqd/events";
const CROP_ASPECT = 16 / 9;

interface Props {
  images: FqdEventImageInput[];
  onChange: (images: FqdEventImageInput[]) => void;
}

// Best-effort Cloudinary public_id from a delivery URL.
function cloudinaryIdFromUrl(url: string): string | null {
  const m = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return m ? m[1] : null;
}

const reindex = (list: FqdEventImageInput[]) =>
  list.map((img, i) => ({ ...img, order: i }));

// Multi-image manager for an event: drag & drop (or browse) as many photos as
// you want at once, reorder by drag, crop any one, edit alt text, delete.
export function ImageManager({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(0);

  // Which image (by url) is being cropped, plus the cropper state.
  const [cropUrl, setCropUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState<Area | null>(null);
  const [savingCrop, setSavingCrop] = useState(false);

  function appendUrls(urls: string[]) {
    if (!urls.length) return;
    const existing = new Set(images.map((i) => i.url));
    const added = urls
      .filter((u) => u && !existing.has(u))
      .map((url) => ({
        url,
        cloudinaryId: cloudinaryIdFromUrl(url),
        alt: "",
        order: 0,
      }));
    onChange(reindex([...images, ...added]));
  }

  // Batch upload: every dropped/selected file uploads in parallel, then all get
  // appended to the list.
  const onDrop = useCallback(
    async (files: File[]) => {
      if (!files.length) return;
      setUploading((n) => n + files.length);
      const results = await Promise.all(
        files.map(async (file) => {
          try {
            return await uploadCroppedImage(file, FOLDER);
          } catch {
            return null;
          } finally {
            setUploading((n) => n - 1);
          }
        }),
      );
      appendUrls(results.filter((u): u is string => Boolean(u)));
    },
    // appendUrls closes over `images`; recompute per render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  function update(url: string, patch: Partial<FqdEventImageInput>) {
    onChange(images.map((img) => (img.url === url ? { ...img, ...patch } : img)));
  }

  function remove(url: string) {
    onChange(reindex(images.filter((img) => img.url !== url)));
  }

  function openCrop(url: string) {
    setCropUrl(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setPixels(null);
  }

  async function confirmCrop() {
    if (!cropUrl || !pixels) return;
    setSavingCrop(true);
    try {
      const blob = await getCroppedBlob(cropUrl, pixels);
      const newUrl = await uploadCroppedImage(blob, FOLDER);
      onChange(
        images.map((img) =>
          img.url === cropUrl
            ? { ...img, url: newUrl, cloudinaryId: cloudinaryIdFromUrl(newUrl) }
            : img,
        ),
      );
      setCropUrl(null);
    } catch {
      /* leave the modal open on failure */
    } finally {
      setSavingCrop(false);
    }
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors",
          isDragActive
            ? "border-secondary bg-secondary/10"
            : "border-dark-600 hover:border-secondary/60",
        )}
      >
        <input {...getInputProps()} />
        <RiUploadCloud2Line className="size-8 text-light-400" />
        <p className="text-sm text-white">
          {isDragActive
            ? "Drop the images here"
            : "Drag & drop event images here, or click to browse"}
        </p>
        <p className="text-xs text-light-400">
          Add as many as you like — crop and reorder them below.
        </p>
        {uploading > 0 && (
          <p className="flex items-center gap-1.5 text-xs text-secondary">
            <RiLoader4Line className="size-3.5 animate-spin" />
            Uploading {uploading} image{uploading === 1 ? "" : "s"}…
          </p>
        )}
      </div>

      <MediaLibraryPicker onSelect={(url) => appendUrls([url])} />

      {images.length > 0 && (
        <ReorderableList
          items={images}
          getId={(img) => img.url}
          onReorder={(next) => onChange(reindex(next))}
          itemClassName="group"
          renderItem={(img) => (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt=""
                className="h-14 w-20 shrink-0 rounded object-cover"
              />
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
                  aria-label="Crop image"
                  onClick={() => openCrop(img.url)}
                  className="text-light-400 transition-colors hover:text-white"
                >
                  <RiCrop2Line className="size-5" />
                </button>
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

      {/* Crop modal for a single image. */}
      {cropUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-dark-600 bg-dark-500">
            <div className="flex items-center justify-between border-b border-dark-600 px-5 py-4">
              <h3 className="text-sm font-medium text-white">Crop image</h3>
              <button
                type="button"
                onClick={() => setCropUrl(null)}
                className="text-light-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="min-h-0 flex-1 p-5">
              <div className="relative h-[50vh] min-h-[320px] w-full overflow-hidden rounded-xl bg-dark-700">
                <Cropper
                  image={cropUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={CROP_ASPECT}
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, areaPixels) => setPixels(areaPixels)}
                />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-light-400">Zoom</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-secondary"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-dark-600 px-5 py-4">
              <button
                type="button"
                onClick={() => setCropUrl(null)}
                disabled={savingCrop}
                className="px-3 py-2 text-sm text-light-400 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmCrop}
                disabled={savingCrop || !pixels}
                className="inline-flex items-center gap-1.5 rounded-lg bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success-600 disabled:opacity-50"
              >
                {savingCrop && <RiLoader4Line className="size-4 animate-spin" />}
                {savingCrop ? "Saving…" : "Save crop"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
