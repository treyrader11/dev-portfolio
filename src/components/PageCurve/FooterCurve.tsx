"use client";

import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import PageCurve from "./index";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

// A white curve that domes over the dark site footer and flattens to a straight
// divider as the footer scrolls fully into view — the same effect the home page
// gets from SlidingImages, packaged so any page can drop it in. Render it as the
// last child of the page content (inside Inner), on a white background, so the
// curve reads as the content doming over the footer.
export default function FooterCurve({ className }: Props) {
  const container = useRef<HTMLDivElement>(null);

  // Track this element's bottom edge crossing the viewport: a full dome while it
  // sits at the fold (footer still below), flattening to a line as you scroll
  // the last screen and the footer comes fully into view.
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["end end", "end start"],
  });
  const height = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <div ref={container} className={cn("relative z-[1] bg-white", className)}>
      <PageCurve height={height} />
    </div>
  );
}
