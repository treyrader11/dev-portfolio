import { useState } from "react";
import {
  RiImageAddLine,
  RiDeleteBinLine,
  RiCheckLine,
} from "react-icons/ri";
import { IconUploadField } from "@/features/admin/components/icon-upload-field";
import { cn } from "@/lib/utils";

// Theme-color backdrops applied behind the cut-out subject (b_rgb). "None" keeps
// the removed background transparent.
const SWATCHES: { name: string; value: string | null }[] = [
  { name: "Transparent", value: null },
  { name: "Secondary", value: "#934E00" },
  { name: "Dark", value: "#0f0f0f" },
  { name: "Success", value: "#198754" },
  { name: "Accent", value: "#ec4e39" },
  { name: "White", value: "#ffffff" },
];

// Strip any background-removal/color transforms so we always derive from the raw
// image (avoids stacking transforms when re-editing).
function stripBg(url: string): string {
  return url.replace(
    /\/upload\/(?:e_background_removal\/)?(?:b_rgb:[0-9a-fA-F]{6}\/)?/,
    "/upload/",
  );
}

// Build the delivery URL: remove background (needs the Cloudinary add-on) and/or
// paint a theme color behind the subject.
function deriveUrl(
  base: string,
  removeBg: boolean,
  bgColor: string | null,
): string {
  const t: string[] = [];
  if (removeBg || bgColor) t.push("e_background_removal");
  if (bgColor) t.push(`b_rgb:${bgColor.replace("#", "")}`);
  if (!t.length) return base;
  return base.replace("/upload/", `/upload/${t.join("/")}/`);
}

interface MediaImage {
  publicId: string;
  url: string;
}

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export function ProfileAvatarField({ value, onChange }: Props) {
  const [baseUrl, setBaseUrl] = useState(() => stripBg(value || ""));
  const [removeBg, setRemoveBg] = useState(false);
  const [bgColor, setBgColor] = useState<string | null>(null);

  const [library, setLibrary] = useState<MediaImage[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [loadingLib, setLoadingLib] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaImage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isCloudinary = baseUrl.includes("res.cloudinary.com");

  const apply = (base: string, rb: boolean, color: string | null) =>
    onChange(deriveUrl(base, rb, color));

  // New upload (already cropped) → becomes the base; keep current bg options.
  function handleUpload(url: string) {
    const base = stripBg(url);
    setBaseUrl(base);
    apply(base, removeBg, bgColor);
  }

  function pickColor(color: string | null) {
    const rb = color ? true : removeBg;
    setBgColor(color);
    setRemoveBg(rb);
    apply(baseUrl, rb, color);
  }

  function toggleRemove() {
    const rb = !removeBg;
    setRemoveBg(rb);
    apply(baseUrl, rb, bgColor);
  }

  async function openLibrary() {
    setShowLibrary(true);
    setLoadingLib(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      setLibrary(data.images ?? []);
    } catch {
      setLibrary([]);
    }
    setLoadingLib(false);
  }

  function selectFromLibrary(img: MediaImage) {
    const base = stripBg(img.url);
    setBaseUrl(base);
    apply(base, removeBg, bgColor);
    setShowLibrary(false);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: deleteTarget.publicId }),
      });
      if (res.ok) {
        setLibrary((prev) =>
          prev.filter((i) => i.publicId !== deleteTarget.publicId),
        );
      }
    } catch {
      /* ignore */
    }
    setDeleting(false);
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-4">
      {/* Upload + crop (non-destructive — never deletes the previous image). */}
      <IconUploadField
        label="Avatar"
        value={value}
        previewBg="#141516"
        aspect={1}
        folder="profile"
        onChange={handleUpload}
      />

      <button
        type="button"
        onClick={openLibrary}
        className="inline-flex items-center gap-2 rounded-lg border border-dark-600 px-3 py-2 text-sm text-white transition-colors hover:bg-dark-600"
      >
        <RiImageAddLine className="size-4" />
        Choose from uploaded images
      </button>

      {/* Background removal + theme-color backdrop (Cloudinary images only). */}
      {isCloudinary && (
        <div className="space-y-3 rounded-lg border border-dark-600 p-4">
          <label className="flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={removeBg}
              onChange={toggleRemove}
              className="size-4 accent-secondary"
            />
            Remove background
          </label>

          <div>
            <p className="mb-2 text-xs text-light-400">Background color</p>
            <div className="flex flex-wrap gap-2">
              {SWATCHES.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  title={s.name}
                  onClick={() => pickColor(s.value)}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2",
                    bgColor === s.value ? "border-white" : "border-dark-600",
                  )}
                  style={
                    s.value
                      ? { backgroundColor: s.value }
                      : {
                          backgroundImage:
                            "repeating-conic-gradient(#3a3a3a 0% 25%, #1f1f1f 0% 50%)",
                          backgroundSize: "10px 10px",
                        }
                  }
                >
                  {bgColor === s.value && (
                    <RiCheckLine className="size-4 text-white mix-blend-difference" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-light-400">
            Removal/backdrop uses Cloudinary AI Background Removal. If the photo
            doesn&apos;t change, the add-on likely needs enabling on your
            Cloudinary account.
          </p>
        </div>
      )}

      {/* Library picker modal. */}
      {showLibrary && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowLibrary(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-xl border border-dark-600 bg-dark-400 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-white">Uploaded images</h3>
              <button
                onClick={() => setShowLibrary(false)}
                className="text-sm text-light-400 hover:text-white"
              >
                Close
              </button>
            </div>
            {loadingLib ? (
              <p className="text-sm text-light-400">Loading…</p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {library.map((img) => (
                  <div
                    key={img.publicId}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-dark-600"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt=""
                      className="size-full cursor-pointer object-cover"
                      onClick={() => selectFromLibrary(img)}
                    />
                    <button
                      type="button"
                      aria-label="Delete image"
                      onClick={() => setDeleteTarget(img)}
                      className="absolute right-1 top-1 rounded-md bg-black/60 p-1.5 text-error opacity-0 transition-opacity hover:text-error-600 group-hover:opacity-100"
                    >
                      <RiDeleteBinLine className="size-4" />
                    </button>
                  </div>
                ))}
                {!library.length && (
                  <p className="col-span-full text-sm text-light-400">
                    No uploaded images yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete confirmation modal. */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-xl border border-dark-600 bg-dark-400 p-6 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={deleteTarget.url}
              alt=""
              className="mx-auto mb-4 size-24 rounded-lg object-cover"
            />
            <p className="mb-1 font-medium text-white">Delete this image?</p>
            <p className="mb-4 text-sm text-light-400">
              This permanently removes it from Cloudinary and can&apos;t be
              undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-dark-600 px-4 py-2 text-sm text-white hover:bg-dark-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-lg bg-error px-4 py-2 text-sm font-medium text-white hover:bg-error-600 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
