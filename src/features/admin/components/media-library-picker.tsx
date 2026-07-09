import { useState } from "react";
import { RiImageAddLine, RiDeleteBinLine } from "react-icons/ri";

interface MediaImage {
  publicId: string;
  url: string;
}

interface Props {
  // Called with the chosen image's Cloudinary URL.
  onSelect: (url: string) => void;
  buttonLabel?: string;
}

// Reusable "choose from previously uploaded images" picker: a button that opens
// a grid of every image uploaded to Cloudinary (via /api/admin/media), with
// per-image delete. Used by any image field that wants an upload history.
export function MediaLibraryPicker({
  onSelect,
  buttonLabel = "Choose from uploaded images",
}: Props) {
  const [library, setLibrary] = useState<MediaImage[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [loadingLib, setLoadingLib] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaImage | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  function select(img: MediaImage) {
    onSelect(img.url);
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
    <>
      <button
        type="button"
        onClick={openLibrary}
        className="inline-flex items-center gap-2 rounded-lg border border-dark-600 px-3 py-2 text-sm text-white transition-colors hover:bg-dark-600"
      >
        <RiImageAddLine className="size-4" />
        {buttonLabel}
      </button>

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
                      onClick={() => select(img)}
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
    </>
  );
}
