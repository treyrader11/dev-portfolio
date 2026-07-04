"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  height?: string | number | MotionValue<number> | MotionValue<string>;
  // Fill color of the curve (Tailwind bg-* class). Should match the color of the
  // content it caps so it reads as that content doming over the footer. Defaults
  // to white; pages with a different bottom color (e.g. the contact page's
  // slate-100 panel) pass their own.
  bgClass?: string;
}

// The bottom curve that domes over the dark footer and flattens to a straight
// line on scroll. Dimensions mirror the awwwards portfolio original exactly:
// the child is 1550% tall / 120% wide, shifted -10% left, with a `0 0 50% 50%`
// radius (a wide elliptical dome, NOT a full pill) and a large soft drop shadow.
// The parent's animated height (50 -> 0) drives the flatten. It sits flush with
// the content above it (no top margin) so the curve always caps the content
// directly, regardless of a page's own trailing padding.
const PageCurve = forwardRef<HTMLDivElement, Props>(function PageCurve(
  { className, height, bgClass = "bg-white" },
  ref,
) {
  return (
    <motion.div
      ref={ref}
      style={{ height }}
      className={cn("relative", bgClass, className)}
    >
      <div
        className={cn(
          "absolute",
          "h-[1550%]",
          "w-[120%]",
          "-left-[10%]",
          "rounded-b-[50%]",
          bgClass,
          "z-[1]",
          "shadow-[0px_60px_50px_rgba(0,0,0,0.748)]",
        )}
      />
    </motion.div>
  );
});

export default PageCurve;
