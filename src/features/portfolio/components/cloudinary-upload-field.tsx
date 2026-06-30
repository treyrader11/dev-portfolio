"use client";

import { CldUploadWidget } from "next-cloudinary";

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

// Admin image picker: uploads straight from the browser to Cloudinary using a
// short-lived signature from /api/admin/upload, then stores the returned URL.
// A text field is kept as a fallback for pasting an existing URL or /public path.
export function CloudinaryUploadField({
  label,
  value,
  onChange,
  folder = "portfolio/projects",
}: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <div className="flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={label}
            className="h-14 w-14 rounded object-cover border border-gray-200 bg-gray-50"
          />
        ) : (
          <div className="h-14 w-14 rounded border border-dashed border-gray-300 bg-gray-50" />
        )}

        <CldUploadWidget
          signatureEndpoint="/api/admin/upload"
          options={{
            folder,
            multiple: false,
            sources: ["local", "url", "camera"],
            maxFiles: 1,
          }}
          onSuccess={(result) => {
            const info = result?.info;
            if (info && typeof info === "object" && "secure_url" in info) {
              onChange((info as { secure_url: string }).secure_url);
            }
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="px-3 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap"
            >
              {value ? "Replace" : "Upload"}
            </button>
          )}
        </CldUploadWidget>
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="or paste an image URL / /public path"
        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
      />
    </div>
  );
}
