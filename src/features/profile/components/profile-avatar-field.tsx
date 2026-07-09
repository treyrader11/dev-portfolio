import { useState } from "react";
import { RiCheckLine } from "react-icons/ri";
import { IconUploadField } from "@/features/admin/components/icon-upload-field";
import { MediaLibraryPicker } from "@/features/admin/components/media-library-picker";
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

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export function ProfileAvatarField({ value, onChange }: Props) {
  const [baseUrl, setBaseUrl] = useState(() => stripBg(value || ""));
  const [removeBg, setRemoveBg] = useState(false);
  const [bgColor, setBgColor] = useState<string | null>(null);

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

  // Pick an existing upload → becomes the base (bg options preserved).
  function selectFromLibrary(url: string) {
    const base = stripBg(url);
    setBaseUrl(base);
    apply(base, removeBg, bgColor);
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

      <MediaLibraryPicker onSelect={selectFromLibrary} />

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
    </div>
  );
}
