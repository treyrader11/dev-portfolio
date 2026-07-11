"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper, { type Area } from "react-easy-crop";
import {
  RiDeleteBinLine,
  RiUploadCloud2Line,
  RiCrop2Line,
  RiLoader4Line,
  RiFileCopyLine,
  RiCheckLine,
  RiSparkling2Line,
  RiDraggable,
} from "react-icons/ri";
import { MediaLibraryPicker } from "@/features/admin/components/media-library-picker";
import { ReorderableList } from "@/features/admin/components/reorderable-list";
import { getCroppedBlob } from "@/features/admin/lib/crop-image";
import { uploadCroppedImage } from "@/features/admin/lib/upload-cropped-image";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import { cn } from "@/lib/utils";
import type { FqdEventImageInput } from "../types/fqd-types";

const FOLDER = "fqd/events";
const CROP_ASPECT = 16 / 9;

// Event details the AI image search uses to build its query.
export interface ImageSearchDetails {
  title: string;
  locationName?: string;
  address?: string;
  startDate?: string;
  category?: string;
  subcategory?: string;
  website?: string;
  description?: string;
}

interface Props {
  images: FqdEventImageInput[];
  onChange: (images: FqdEventImageInput[]) => void;
  // Event slug — drives the alt-text naming convention <slug>_<index>.
  slug: string;
  // When provided, enables the "AI web search for images" button.
  searchDetails?: ImageSearchDetails;
}

// Best-effort Cloudinary public_id from a delivery URL.
function cloudinaryIdFromUrl(url: string): string | null {
  const m = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return m ? m[1] : null;
}

const padIndex = (n: number) => String(n).padStart(2, "0");

// The descriptor portion of an alt already in <slug>_<index>[_<descriptor>]
// form, or null when the alt doesn't follow the convention (a fully custom alt
// the admin typed). Slugs are hyphenated, so "_" reliably splits the parts.
function altDescriptor(alt: string): string | null {
  const parts = alt.split("_");
  if (parts.length < 2 || !/^\d+$/.test(parts[1])) return null;
  return parts.slice(2).join("_");
}

// The conventional alt for an image at a position: "<slug>_<NN>" with any
// existing descriptor preserved. Blank alts get the bare prefix (never blank);
// fully custom alts are left untouched.
function conventionalAlt(
  slug: string,
  order: number,
  prevAlt: string | null | undefined,
): string {
  const prefix = `${slug}_${padIndex(order + 1)}`;
  const prev = (prevAlt ?? "").trim();
  if (!prev) return prefix;
  const desc = altDescriptor(prev);
  if (desc === null) return prev;
  return desc ? `${prefix}_${desc}` : prefix;
}

// Reindex order + apply the alt naming convention across the whole list.
function applyConvention(
  list: FqdEventImageInput[],
  slug: string,
): FqdEventImageInput[] {
  return list.map((img, i) => ({
    ...img,
    order: i,
    alt: conventionalAlt(slug, i, img.alt),
  }));
}

// Multi-image manager for an event: drag & drop (or browse) as many photos as
// you want at once, reorder by drag, crop any one, edit alt text, delete.
export function ImageManager({
  images,
  onChange,
  slug,
  searchDetails,
}: Props) {
  const { addNotification } = useNotificationsContext();
  const [uploading, setUploading] = useState(0);
  const [searching, setSearching] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Keep every alt following the <slug>_<index>[_descriptor] convention as
  // images are added (incl. from research/website), reordered, or the slug
  // changes. Idempotent, so it settles in one pass without looping.
  useEffect(() => {
    const next = applyConvention(images, slug);
    const differs =
      next.length !== images.length ||
      next.some(
        (n, i) => n.alt !== images[i].alt || n.order !== images[i].order,
      );
    if (differs) onChange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, slug]);

  async function copyAlt(url: string, alt: string) {
    try {
      await navigator.clipboard.writeText(alt);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl((c) => (c === url ? null : c)), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  // AI web-search for images of this event using its current details, then
  // append any found images (already uploaded to Cloudinary) to the list.
  async function searchImages() {
    if (searching || !searchDetails) return;
    if (!searchDetails.title?.trim()) {
      addNotification({
        text: "Add a title first so the search has something to go on",
        variant: "error",
      });
      return;
    }
    setSearching(true);
    try {
      const res = await fetch("/api/fqd/search-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchDetails),
      });
      const data = await res.json();
      const found: { url: string }[] =
        res.ok && Array.isArray(data.images) ? data.images : [];
      if (found.length === 0) {
        addNotification({
          text: res.ok
            ? "No images found for this event — try adding more details"
            : (data.error ?? "Image search failed"),
          variant: res.ok ? "success" : "error",
        });
        return;
      }
      appendUrls(found.map((i) => i.url));
      addNotification({
        text: `Found ${found.length} image${found.length === 1 ? "" : "s"} — crop and reorder as needed`,
        variant: "success",
      });
    } catch {
      addNotification({
        text: "Image search failed — request error",
        variant: "error",
      });
    } finally {
      setSearching(false);
    }
  }

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
    onChange(applyConvention([...images, ...added], slug));
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
    onChange(applyConvention(images.filter((img) => img.url !== url), slug));
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

      {searchDetails && (
        <button
          type="button"
          onClick={searchImages}
          disabled={searching}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-secondary/50 bg-secondary/10 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-secondary/20 disabled:opacity-50"
        >
          {searching ? (
            <RiLoader4Line className="size-4 animate-spin" />
          ) : (
            <RiSparkling2Line className="size-4" />
          )}
          {searching
            ? "Searching the web for images…"
            : "AI web search for images"}
        </button>
      )}

      <MediaLibraryPicker onSelect={(url) => appendUrls([url])} />

      {images.length > 0 && (
        <p className="text-xs text-light-400">
          Alt text auto-fills as{" "}
          <code className="rounded bg-dark-600 px-1 text-white">
            {slug || "event"}_01
          </code>{" "}
          — append a short descriptor (e.g.{" "}
          <code className="rounded bg-dark-600 px-1 text-white">
            _spirited-awards-ceremony
          </code>
          ) for SEO.
        </p>
      )}

      {images.length > 0 && (
        <ReorderableList
          items={images}
          getId={(img) => img.url}
          onReorder={(next) => onChange(applyConvention(next, slug))}
          itemClassName="group"
          renderItem={(img) => (
            <div className="flex items-start gap-3">
              {/* Drag handle — press and drag to reorder. */}
              <button
                type="button"
                data-drag-handle
                aria-label="Drag to reorder"
                className="mt-1.5 shrink-0 cursor-grab touch-none text-light-400 transition-colors hover:text-white active:cursor-grabbing"
              >
                <RiDraggable className="size-5" />
              </button>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt=""
                className="h-16 w-24 shrink-0 rounded object-cover"
              />

              <div
                data-no-drag
                className="min-w-0 flex-1 space-y-2"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <label className="block text-[10px] font-semibold uppercase tracking-wide text-light-400">
                  Alt text
                </label>
                <div className="flex items-center gap-2">
                  <input
                    value={img.alt ?? ""}
                    onChange={(e) => update(img.url, { alt: e.target.value })}
                    placeholder={`${slug || "event"}_01_descriptor`}
                    className="min-w-0 flex-1 rounded-lg border border-dark-600 bg-dark-600 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                  <button
                    type="button"
                    aria-label="Copy alt text"
                    title="Copy alt text"
                    onClick={() => copyAlt(img.url, img.alt ?? "")}
                    className={cn(
                      "shrink-0 rounded-lg border border-dark-600 p-2 transition-colors",
                      copiedUrl === img.url
                        ? "text-success"
                        : "text-light-400 hover:text-white",
                    )}
                  >
                    {copiedUrl === img.url ? (
                      <RiCheckLine className="size-4" />
                    ) : (
                      <RiFileCopyLine className="size-4" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <button
                    type="button"
                    onClick={() => openCrop(img.url)}
                    className="inline-flex items-center gap-1 text-light-400 transition-colors hover:text-white"
                  >
                    <RiCrop2Line className="size-4" />
                    Crop
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(img.url)}
                    className="inline-flex items-center gap-1 text-error transition-colors hover:text-error-600"
                  >
                    <RiDeleteBinLine className="size-4" />
                    Remove
                  </button>
                </div>
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
