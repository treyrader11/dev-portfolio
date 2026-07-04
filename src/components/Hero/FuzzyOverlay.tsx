"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useWindowDimensions";

interface Props {
  className?: string;
}

// A lo-fi, TV-static "fuzzy" grain that jitters continuously. It's meant to be a
// full-bleed background layer: oversized (-inset-[100%]) so the tiled noise
// always covers the parent, which must be `relative overflow-hidden` so only the
// covered area shows. The animation is transform-only (GPU-composited, no
// layout/paint) and the layer is pointer-events-none + aria-hidden, so it never
// blocks or overlaps content and adds no measurable latency.
export default function FuzzyOverlay({ className }: Props) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Desktop only: never mount on mobile so the perpetual grain animation doesn't
  // run on phones. Rendering nothing until mounted keeps it hydration-safe (the
  // server and first client render both produce nothing).
  if (!mounted || isMobile) return null;

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
