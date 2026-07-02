"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Reorder, useDragControls } from "framer-motion";
import Cropper, { type Area } from "react-easy-crop";
import { useDropzone } from "react-dropzone";
import {
  RiArrowLeftLine,
  RiDraggable,
  RiDeleteBinLine,
  RiUploadCloud2Line,
} from "react-icons/ri";
import AdminLayout from "@/features/admin/components/admin-layout";
import LaptopMockup from "@/components/laptop-mockup";
import { getCroppedBlob } from "@/features/admin/lib/crop-image";
import {
  cloudinaryConfigured,
  uploadCroppedImage,
} from "@/features/admin/lib/upload-cropped-image";
import { cn, slugify } from "@/lib/utils";

interface ProjectRaw {
  id: string;
  title: string;
  image: unknown;
}

interface Props {
  project: ProjectRaw;
}

// Crop shots to the laptop screen's aspect (screen hole 928x531 in the frame).
const SHOT_ASPECT = 928 / 531;

export function ProductShotsPage({ project }: Props) {
  const imageBase = useMemo(
    () =>
      (project.image && typeof project.image === "object"
        ? project.image
        : {}) as Record<string, unknown>,
    [project.image],
  );
  const initialShots = useMemo(
    () => (Array.isArray(imageBase.shots) ? (imageBase.shots as string[]) : []),
    [imageBase],
  );

  const [shots, setShots] = useState<string[]>(initialShots);
  const [savedShots, setSavedShots] = useState<string[]>(initialShots);

  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState<Area | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editHref = `/admin/projects/${slugify(project.title)}`;
  const dirty = JSON.stringify(shots) !== JSON.stringify(savedShots);

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
    noClick: true,
  });

  useEffect(() => {
    return () => {
      if (rawSrc) URL.revokeObjectURL(rawSrc);
    };
  }, [rawSrc]);

  // Debounced auto-save whenever the shot list changes (add / remove / reorder).
  useEffect(() => {
    if (JSON.stringify(shots) === JSON.stringify(savedShots)) return;
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/projects/${project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: { ...imageBase, shots } }),
        });
        if (res.ok) setSavedShots(shots);
      } catch {
        // keep local state; user can retry by making another change
      }
    }, 500);
    return () => clearTimeout(t);
  }, [shots, savedShots, project.id, imageBase]);

  function resetAdd() {
    setRawSrc(null);
    setPreviewUrl(null);
    setPixels(null);
    setError(null);
  }

  async function makePreview() {
    if (!rawSrc || !pixels) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await getCroppedBlob(rawSrc, pixels);
      const url = await uploadCroppedImage(blob, "portfolio/shots");
      setPreviewUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  function acceptShot() {
    if (!previewUrl) return;
    setShots((s) => [...s, previewUrl]);
    resetAdd();
  }

  return (
    <AdminLayout
      title="Product Shots"
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Projects", href: "/admin/projects" },
        { label: project.title, href: editHref },
        { label: "Product Shots" },
      ]}
    >
      <div className="w-full max-w-3xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            href={editHref}
            className="inline-flex items-center gap-1.5 text-sm text-light-400 hover:text-white"
          >
            <RiArrowLeftLine className="size-4" /> Back to project
          </Link>
          <span className="text-xs text-light-400">
            {dirty ? "Saving…" : "All changes saved"}
          </span>
        </div>

        {!cloudinaryConfigured && (
          <p className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-500">
            Set Cloudinary env vars to enable uploads.
          </p>
        )}

        {/* Existing shots — drag the handle to reorder. */}
        {shots.length > 0 ? (
          <Reorder.Group
            axis="y"
            values={shots}
            onReorder={setShots}
            className="space-y-3"
          >
            {shots.map((url) => (
              <ShotCard
                key={url}
                url={url}
                onRemove={() => setShots((s) => s.filter((u) => u !== url))}
              />
            ))}
          </Reorder.Group>
        ) : (
          <p className="mb-4 text-sm text-light-400">No product shots yet.</p>
        )}

        {/* Add a new shot */}
        <div
          {...getRootProps()}
          onClick={() => open()}
          className={cn(
            "mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
            isDragActive
              ? "border-secondary bg-secondary/10"
              : "border-dark-600 hover:border-secondary/60",
          )}
        >
          <input {...getInputProps()} />
          <RiUploadCloud2Line className="size-8 text-light-400" />
          <p className="text-sm text-light-400">
            {isDragActive ? (
              "Drop the image here"
            ) : (
              <>
                Drag &amp; drop a landscape screenshot, or{" "}
                <span className="text-secondary underline">browse</span>
              </>
            )}
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
            className="mt-1 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary/80"
          >
            Add product shot
          </button>
        </div>
      </div>

      {/* Crop overlay */}
      {rawSrc && !previewUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl rounded-xl border border-dark-600 bg-dark-500 p-4">
            <h3 className="mb-3 text-sm font-medium text-white">
              Crop the screenshot
            </h3>
            <div className="relative h-[50vh] min-h-[260px] w-full overflow-hidden rounded-lg bg-dark-700">
              <Cropper
                image={rawSrc}
                crop={crop}
                zoom={zoom}
                aspect={SHOT_ASPECT}
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
            {error && <p className="mt-2 text-xs text-error">{error}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={resetAdd}
                disabled={busy}
                className="px-3 py-2 text-sm text-light-400 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={makePreview}
                disabled={busy || !pixels}
                className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary/80 disabled:opacity-50"
              >
                {busy ? "Uploading…" : "Crop & preview"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review overlay — the crop wrapped in the laptop frame */}
      {previewUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl rounded-xl border border-dark-600 bg-dark-500 p-4">
            <h3 className="mb-3 text-sm font-medium text-white">
              Looks good?
            </h3>
            <div className="mx-auto w-full max-w-[min(92vw,560px)]">
              <LaptopMockup src={previewUrl} alt="Product shot preview" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={resetAdd}
                className="px-3 py-2 text-sm text-light-400 hover:text-white"
              >
                Retake
              </button>
              <button
                type="button"
                onClick={acceptShot}
                className="rounded-lg bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success-600"
              >
                Looks good!
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function ShotCard({ url, onRemove }: { url: string; onRemove: () => void }) {
  const controls = useDragControls();
  return (
    <Reorder.Item value={url} dragListener={false} dragControls={controls}>
      <div className="flex items-center gap-3 rounded-lg border border-dark-600 bg-dark-400 p-3">
        <button
          type="button"
          aria-label="Drag to reorder"
          onPointerDown={(e) => controls.start(e)}
          className="cursor-grab touch-none text-light-400 hover:text-white active:cursor-grabbing"
        >
          <RiDraggable className="size-5" />
        </button>
        <div className="w-40 shrink-0 sm:w-56">
          <LaptopMockup src={url} alt="Product shot" />
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove shot"
          className="ml-auto text-error transition-colors hover:text-error-600"
        >
          <RiDeleteBinLine className="size-5" />
        </button>
      </div>
    </Reorder.Item>
  );
}
