"use client";

import { useState } from "react";
import { RiFileCopyLine, RiCheckLine } from "react-icons/ri";

// Shows an image's alt text with a copy-to-clipboard button. Used under each
// image on the event details page.
export function EventImageAlt({ alt }: { alt: string }) {
  const [copied, setCopied] = useState(false);
  if (!alt) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(alt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="mt-2 flex items-start gap-1.5">
      <p className="min-w-0 flex-1 break-words text-xs text-light-400">
        <span className="font-semibold uppercase tracking-wide text-secondary">
          Alt:{" "}
        </span>
        {alt}
      </p>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy alt text"
        title="Copy alt text"
        className="shrink-0 text-light-400 transition-colors hover:text-white"
      >
        {copied ? (
          <RiCheckLine className="size-4 text-success" />
        ) : (
          <RiFileCopyLine className="size-4" />
        )}
      </button>
    </div>
  );
}
