"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper, { type Area } from "react-easy-crop";
import { RiUploadCloud2Line, RiImageLine } from "react-icons/ri";
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
}

// Icon picker: drag-and-drop OR click to browse, crop the image to a square,
// then upload the cropped result to Cloudinary. A URL field remains as a manual
// fallback (paste an existing URL or /public path).
export function IconUploadField({
  label,
  value,
  onChange,
  previewBg = "#ffffff",
  folder,
}: Props) {
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

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
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

  async function confirmCrop() {
    if (!rawSrc || !pixels) return;
    setUploading(true);
    setError(null);
    try {
      const blob = await getCroppedBlob(rawSrc, pixels);
      const url = await uploadCroppedImage(blob, folder);
      onChange(url);
      setRawSrc(null);
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

      <div className="flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={label}
            style={{ backgroundColor: previewBg }}
            className="size-14 rounded-lg object-contain border border-dark-600 p-1.5"
          />
        ) : (
          <div className="flex size-14 items-center justify-center rounded-lg border border-dashed border-dark-600 text-light-400">
            <RiImageLine className="size-6" />
          </div>
        )}

        {/* Dropzone — drop a file anywhere in here, or click Browse. */}
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-4 py-3 text-center transition-colors",
            isDragActive
              ? "border-secondary bg-secondary/10"
              : "border-dark-600 hover:border-secondary/60",
          )}
          onClick={() => open()}
        >
          <input {...getInputProps()} />
          <RiUploadCloud2Line className="mb-1 size-5 text-light-400" />
          <p className="text-xs text-light-400">
            {isDragActive ? (
              "Drop the image here"
            ) : (
              <>
                Drag &amp; drop, or{" "}
                <span className="text-secondary underline">browse</span>
              </>
            )}
          </p>
        </div>
      </div>

      {!cloudinaryConfigured && (
        <p className="mt-1 text-xs text-amber-500">
          Set Cloudinary env vars to enable uploads. You can still paste a URL
          below.
        </p>
      )}

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="or paste an image URL / /public path"
        className="mt-2 w-full px-3 py-2 border border-dark-600 rounded-lg text-sm"
      />

      {/* Crop modal — square crop, zoom, confirm before uploading. */}
      {rawSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-dark-600 bg-dark-500 p-4">
            <h3 className="mb-3 text-sm font-medium text-white">Crop icon</h3>

            <div className="relative h-64 w-full overflow-hidden rounded-lg bg-dark-700">
              <Cropper
                image={rawSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
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

            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRawSrc(null)}
                disabled={uploading}
                className="px-3 py-2 text-sm text-light-400 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmCrop}
                disabled={uploading || !pixels}
                className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary/80 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
