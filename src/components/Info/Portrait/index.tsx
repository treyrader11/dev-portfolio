"use client";

import { cn, resolveImageSrc } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";
import type { MotionStyle } from "framer-motion";
import { useState } from "react";

// Bundled fallback used when the CMS portrait hasn't been set.
export const DEFAULT_PORTRAIT = "/images/portraits/profile.png";

// easeOutCubic — the ease used by the em-corporate about-image hover.
const HOVER_EASE = "ease-[cubic-bezier(0.215,0.61,0.355,1)]";

interface Props {
  className?: string;
  // Scroll-driven parallax (a `top` MotionValue) applied to the outer element.
  style?: MotionStyle;
  // CMS-editable portrait image; falls back to the bundled default.
  src?: string;
}

export function Portrait({ className, style, src }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    // Outer element keeps the scroll parallax (the `top` MotionValue in `style`)
    // — untouched by the hover animation, which lives on the frame/image below.
    <motion.div
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative",
        "mx-auto",
        "w-full",
        "max-w-[25vh]",
        "md:max-w-full",
        "h-[60vh]",
        "mr-4",
        className
      )}
    >
      {/* em-corporate hover: the frame gently shrinks (0.96) while the image
          zooms in (1.09) behind the clip, on mismatched slow eases. */}
      <div
        className={cn(
          "relative",
          "h-full",
          "w-full",
          "overflow-hidden",
          "rounded-2xl",
          "transition-transform",
          "duration-[1500ms]",
          HOVER_EASE,
          hovered && "scale-[0.96]"
        )}
      >
        <Image
          fill
          priority
          alt="Full profile picture"
          src={resolveImageSrc(src || DEFAULT_PORTRAIT, "/images/portraits")}
          sizes="100vw"
          className={cn(
            "object-cover",
            "z-[1]",
            "transition-transform",
            "duration-[2000ms]",
            HOVER_EASE,
            hovered && "scale-[1.09]"
          )}
        />
      </div>
    </motion.div>
  );
}
