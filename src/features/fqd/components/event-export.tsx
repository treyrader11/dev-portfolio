"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  RiDownloadLine,
  RiFilePdf2Line,
  RiFileWord2Line,
  RiFolderZipLine,
} from "react-icons/ri";

interface Props {
  eventId: string;
}

// Export button + dark-themed format-choice modal (PDF / Word), mirroring the
// public resume badge's modal but styled for the admin dark theme. Each choice
// is a plain download link to the export endpoint.
export function EventExport({ eventId }: Props) {
  const [open, setOpen] = useState(false);
  const url = (format: "pdf" | "docx") =>
    `/api/fqd/events/${eventId}?export=${format}`;
  const listingUrl = `/api/fqd/events/${eventId}?download=listing`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dark-600 px-3 py-2 text-sm text-white transition-colors hover:border-secondary/60"
      >
        <RiDownloadLine className="size-4" />
        Export
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="relative z-10 w-full max-w-sm rounded-lg border border-dark-600 bg-dark-400 p-6 shadow-2xl"
            >
              <h3 className="text-lg font-medium text-white">Export event</h3>
              <p className="mt-1 text-sm text-light-400">
                Choose a format to download.
              </p>

              {/* Primary: the formatted listing bundled with its images. */}
              <a
                href={listingUrl}
                download
                onClick={() => setOpen(false)}
                className="mt-5 flex items-center gap-3 rounded-lg bg-secondary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-secondary/90"
              >
                <RiFolderZipLine className="size-5 shrink-0" />
                <span className="flex flex-col text-left">
                  Listing + images (.zip)
                  <span className="text-xs font-normal text-white/80">
                    Formatted .docx with all images as PNGs
                  </span>
                </span>
              </a>

              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <a
                  href={url("pdf")}
                  download
                  onClick={() => setOpen(false)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-dark-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-dark-600"
                >
                  <RiFilePdf2Line className="size-4" />
                  PDF
                </a>
                <a
                  href={url("docx")}
                  download
                  onClick={() => setOpen(false)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-dark-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-dark-600"
                >
                  <RiFileWord2Line className="size-4" />
                  Word (.docx)
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
