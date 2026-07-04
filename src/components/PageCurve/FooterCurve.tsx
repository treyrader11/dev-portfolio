"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useScroll, useTransform } from "framer-motion";
import PageCurve from "./index";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  // Fill color of the curve (Tailwind bg-* class), matched to the content it
  // caps. Defaults to white; pass e.g. "bg-slate-100" on pages whose bottom
  // content is a different color.
  bgClass?: string;
}

// The site-wide bottom curve: a white dome that overlaps the dark footer and
// flattens to a straight divider as the footer scrolls into view. Self-contained
// so it can be dropped at the bottom of any layout — `overflow-x-clip` hides the
// curve's wide horizontal overflow (no stray horizontal scrollbar) while leaving
// vertical overflow visible so the dome can extend down over the footer.
export default function FooterCurve({
  className,
  bgClass = "bg-white",
}: Props) {
  const container = useRef<HTMLDivElement>(null);

  // Base curve height, proportional to viewport WIDTH so the dome holds the same
  // shape on every screen — but in PIXELS, not `vw`. iOS Safari fails to resolve
  // the dome's percentage height (h-[1550%]) against a vw-unit parent, which hid
  // the curve entirely on iPhone; a measured px value resolves everywhere.
  // innerWidth * 0.035 === 3.5vw (≈ 50px at a 1440px desktop). It's a motion
  // value (not React state) so the height stays reactive to resize.
  const baseHeight = useMotionValue(50);
  useEffect(() => {
    const update = () => baseHeight.set(window.innerWidth * 0.035);
    update();
    // On iOS the browser chrome (URL bar) collapses after first paint, so the
    // initial innerWidth can be read before the viewport settles. A delayed
    // second measurement re-reads the width once the chrome has settled.
    const timer = setTimeout(update, 300);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      clearTimeout(timer);
    };
  }, [baseHeight]);

  // "start 120%" fires the trigger before the container reaches the viewport
  // bottom, so the dome is already forming on iOS/WebKit where a later trigger
  // left it collapsed off-screen.
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 120%", "end start"],
  });

  // Full dome as the curve enters from the bottom of the viewport, flattened by
  // the time it has scrolled 90% of the way up. Recomputes on scroll OR resize.
  // A 4px floor keeps the curve from ever collapsing fully to zero (which read
  // as "no curve" on iOS/WebKit).
  const height = useTransform(
    [scrollYProgress, baseHeight],
    ([p, b]: number[]) => Math.max(b * (1 - Math.min(p / 0.9, 1)), 4),
  );

  return (
    <div
      ref={container}
      // -mt-px overlaps the content above by a hair to close the sub-pixel seam
      // between the content and the curve (both share bgClass, so it's invisible).
      className={cn(
        "relative z-[1] -mt-px overflow-x-clip",
        bgClass,
        className,
      )}
    >
      <PageCurve height={height} bgClass={bgClass} />
    </div>
  );
}
