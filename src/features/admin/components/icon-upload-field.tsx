"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper, { type Area } from "react-easy-crop";
import {
  RiUploadCloud2Line,
  RiImageLine,
  RiPencilLine,
} from "react-icons/ri";
import { cn } from "@/lib/utils";
import { getCroppedBlob } from "../lib/crop-image";
import {
  cloudinaryConfigured,
  uploadCroppedImage,
} from "../lib/upload-cropped-image";

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** Preview swatch background so transparent icons stay visible. */
  previewBg?: string;
  folder?: string;
  /** Crop aspect ratio: 1 = square icon (default), e.g. 16/9 for wide shots. */
  aspect?: number;
}

// Image picker: shows the current image with a pencil button. The pencil opens a
// wide modal where you drag-and-drop or browse for a file, then crop it (to the
// given aspect) before it uploads to Cloudinary. A URL field remains as a manual
// fallback (paste an existing URL or /public path).
export function IconUploadField({
  label,
  value,
  onChange,
  previewBg = "#ffffff",
  folder,
  aspect = 1,
}: Props) {
  const [open, setOpen] = useState(false);
  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read the dropped/selected file into a local object URL for the cropper.
  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError(null);
    setRawSrc(URL.createObjectURL(file));
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open: openFileDialog } =
    useDropzone({
      onDrop,
      accept: { "image/*": [] },
      multiple: false,
      noClick: true, // we trigger the file dialog from our own button
    });

  // Revoke the object URL when we're done with it to avoid leaks.
  useEffect(() => {
    return () => {
      if (rawSrc) URL.revokeObjectURL(rawSrc);
    };
  }, [rawSrc]);

  function closeModal() {
    setRawSrc(null);
    setError(null);
    setOpen(false);
  }

  async function confirmCrop() {
    if (!rawSrc || !pixels) return;
    setUploading(true);
    setError(null);
    try {
      const blob = await getCroppedBlob(rawSrc, pixels);
      const url = await uploadCroppedImage(blob, folder);
      onChange(url);
      closeModal();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-white mb-1">
        {label}
      </label>

      {/* Current image + pencil to edit/replace. Preview keeps the crop aspect. */}
      <div className="flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={label}
            style={{ backgroundColor: previewBg, aspectRatio: String(aspect) }}
            className="h-14 w-auto rounded-lg object-contain border border-dark-600 p-1.5"
          />
        ) : (
          <div
            style={{ aspectRatio: String(aspect) }}
            className="flex h-14 items-center justify-center rounded-lg border border-dashed border-dark-600 text-light-400"
          >
            <RiImageLine className="size-6" />
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Edit image"
          className="inline-flex items-center gap-1.5 rounded-lg border border-dark-600 px-3 py-2 text-sm text-white transition-colors hover:border-secondary/60"
        >
          <RiPencilLine className="size-4" />
          {value ? "Change" : "Add image"}
        </button>
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="or paste an image URL / /public path"
        className="mt-2 w-full px-3 py-2 border border-dark-600 rounded-lg text-sm"
      />

      {/* Wide modal: dropzone first, then crop once an image is chosen. */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-dark-600 bg-dark-500">
            <div className="flex items-center justify-between border-b border-dark-600 px-5 py-4">
              <h3 className="text-sm font-medium text-white">
                {rawSrc ? "Crop icon" : "Upload icon"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-light-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-5">
              {!cloudinaryConfigured && (
                <p className="mb-3 text-xs text-amber-500">
                  Set Cloudinary env vars to enable uploads. You can still paste
                  a URL in the field behind this dialog.
                </p>
              )}

              {!rawSrc ? (
                // Dropzone — big, wide, responsive drop target + browse button.
                <div
                  {...getRootProps()}
                  className={cn(
                    "flex min-h-[45vh] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 text-center transition-colors",
                    isDragActive
                      ? "border-secondary bg-secondary/10"
                      : "border-dark-600 hover:border-secondary/60",
                  )}
                  onClick={() => openFileDialog()}
                >
                  <input {...getInputProps()} />
                  <RiUploadCloud2Line className="size-10 text-light-400" />
                  <p className="text-sm text-light-400">
                    {isDragActive
                      ? "Drop the image here"
                      : "Drag & drop an image here"}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openFileDialog();
                    }}
                    className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary/80"
                  >
                    Browse files
                  </button>
                </div>
              ) : (
                <div>
                  <div className="relative h-[50vh] min-h-[320px] w-full overflow-hidden rounded-xl bg-dark-700">
                    <Cropper
                      image={rawSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={aspect}
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
                  {error && (
                    <p className="mt-2 text-xs text-error">{error}</p>
                  )}
                </div>
              )}
            </div>

            {rawSrc && (
              <div className="flex justify-end gap-2 border-t border-dark-600 px-5 py-4">
                <button
                  type="button"
                  onClick={() => setRawSrc(null)}
                  disabled={uploading}
                  className="px-3 py-2 text-sm text-light-400 hover:text-white disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={confirmCrop}
                  disabled={uploading || !pixels}
                  className="rounded-lg bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success-600 disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Confirm"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
