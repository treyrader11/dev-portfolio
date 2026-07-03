"use client";

import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import PageCurve from "./index";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

// The site-wide bottom curve: a white dome that overlaps the dark footer and
// flattens to a straight divider as the footer scrolls into view. Self-contained
// so it can be dropped at the bottom of any layout — `overflow-x-clip` hides the
// curve's 120%-wide horizontal overflow (no stray horizontal scrollbar) while
// leaving vertical overflow visible so the dome can extend down over the footer.
export default function FooterCurve({ className }: Props) {
  const container = useRef<HTMLDivElement>(null);

  // Matches the awwwards original: full dome as the curve enters from the bottom
  // of the viewport, flattened by the time it has scrolled 90% of the way up.
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });
  const height = useTransform(scrollYProgress, [0, 0.9], [50, 0]);

  return (
    <div
      ref={container}
      className={cn("relative z-[1] overflow-x-clip", className)}
    >
      <PageCurve height={height} />
    </div>
  );
}
