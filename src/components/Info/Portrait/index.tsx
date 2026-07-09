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
  // The photo's own aspect ratio, measured once it loads, so the frame matches
  // the image's dimensions and nothing is cropped. Defaults to a 3:4 portrait
  // until known.
  const [ratio, setRatio] = useState(3 / 4);

  return (
    // Outer element keeps the scroll parallax (the `top` MotionValue in `style`)
    // — untouched by the hover animation, which lives on the frame/image below.
    <motion.div
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn("relative", "mx-auto", "w-full", "mr-4", className)}
    >
      {/* Frame width follows the column; its height is derived from the photo's
          own aspect ratio, so object-cover fills it with no cropping. em-corporate
          hover: frame shrinks (0.96) while the image zooms in (1.09) behind the
          clip, on mismatched slow eases. */}
      <div
        style={{ aspectRatio: ratio }}
        className={cn(
          "relative",
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
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalHeight > 0) {
              setRatio(img.naturalWidth / img.naturalHeight);
            }
          }}
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
