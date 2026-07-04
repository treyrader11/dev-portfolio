"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

// The masked text-reveal lifted from the Evolve demos page (VideoOverlay):
// each line lives in an overflow-hidden box and slides up from below on enter,
// then up and out on exit — with a per-line stagger. Driven by `show`, so it
// plays IN when a card snaps into place and OUT when it snaps away.
//
// NOTE: uses <div>/<motion.div> (block by default) rather than <span> + the
// Tailwind `block` utility, because this project's globals.css defines a custom
// `.block { width: 50px; height: 50px }` decoration class that collides with the
// utility and would clamp every line to a 50px box.
const maskTransition = { duration: 0.75, ease: [0.33, 1, 0.68, 1] as const };

export interface RevealLine {
  text: string;
  className?: string;
}

interface Props {
  lines: RevealLine[];
  // When true the lines reveal up into place; when false they mask up and out.
  show: boolean;
  className?: string;
}

export default function MaskedRevealText({ lines, show, className }: Props) {
  return (
    <div className={className}>
      {lines.map((line, i) => (
        // The clip box stays mounted (full width); the text inside mounts /
        // unmounts so its enter/exit slide is masked by overflow-hidden. The
        // text centers via the parent's text-center.
        <div key={i} className="overflow-hidden">
          <AnimatePresence initial={false}>
            {show && (
              <motion.div
                key="line"
                className={cn("will-change-transform", line.className)}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-110%" }}
                transition={{ ...maskTransition, delay: i * 0.08 }}
              >
                {line.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
