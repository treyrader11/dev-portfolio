"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

// A lo-fi, TV-static "fuzzy" grain that jitters continuously. Pure presentation:
// oversized (-inset-[100%]) so the tiled noise always covers its parent, which
// must be `relative overflow-hidden`. Transform-only (GPU-composited) and
// pointer-events-none + aria-hidden, so it never blocks or overlaps content.
// Gating (which areas/devices show it) lives in NoiseBg.
export default function FuzzyOverlay({ className }: Props) {
  return (
    <motion.div
      aria-hidden
      initial={{ x: "-10%", y: "-10%" }}
      animate={{ x: "10%", y: "10%" }}
      transition={{
        repeat: Infinity,
        duration: 0.2,
        ease: "linear",
        repeatType: "mirror",
      }}
      style={{ backgroundImage: 'url("/black-noise.png")' }}
      className={cn(
        "pointer-events-none absolute -inset-[100%] opacity-[0.15]",
        className,
      )}
    />
  );
}
