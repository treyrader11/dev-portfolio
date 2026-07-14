"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RiNavigationLine } from "react-icons/ri";

interface Props {
  locationName?: string | null;
  address?: string | null;
}

// A location map (shown on ALL devices) plus an "Open maps" button that only
// appears on mobile — tapping it prompts before externally opening Google Maps
// directions to the event from the device's current location (which only makes
// sense on a phone). Mobile detection runs after mount (client-only) so it
// never mismatches the server render.
export function EventLocationMap({ locationName, address }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    setIsMobile(
      /Android|iPhone|iPod|iPad|webOS|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
        navigator.userAgent,
      ),
    );
  }, []);

  const query = [locationName, address].filter(Boolean).join(", ");
  if (!query) return null;

  const encoded = encodeURIComponent(query);
  const embedUrl = `https://maps.google.com/maps?q=${encoded}&z=15&output=embed`;
  // Omitting the origin makes Google Maps navigate from the device's current
  // location.
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-white">Location</h2>
      <div className="overflow-hidden rounded-lg border border-dark-600">
        <iframe
          title="Event location map"
          src={embedUrl}
          className="h-64 w-full"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      {/* Directions button only on mobile — it navigates from the device's
          current location, which only makes sense on a phone. */}
      {isMobile && (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary/90"
        >
          <RiNavigationLine className="size-4" />
          Open maps
        </button>
      )}

      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setConfirming(false)}
            />
            <motion.div
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="relative z-10 w-full max-w-sm rounded-lg border border-dark-600 bg-dark-400 p-6 shadow-2xl"
            >
              <h3 className="text-lg font-medium text-white">
                Open in Google Maps?
              </h3>
              <p className="mt-2 text-sm text-light-400">
                This opens Google Maps to navigate to{" "}
                <span className="text-white">{locationName || address}</span>{" "}
                from your current location.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="px-4 py-2 text-sm text-light-400 hover:text-white"
                >
                  Cancel
                </button>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setConfirming(false)}
                  className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary/90"
                >
                  Open Google Maps
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
