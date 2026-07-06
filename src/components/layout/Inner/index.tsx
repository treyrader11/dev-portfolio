"use client";

import { motion } from "framer-motion";
import { slide, opacity, perspective } from "./anim";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { variants } from "@/lib/motion";
import { usePageTransitionSkip } from "@/lib/page-transition";
import type { Variants } from "@/types/animation";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  backgroundColor?: string;
}

// When skipping, pin every phase to the resting "enter" state so the element
// never animates in or out — without changing the DOM, so children don't remount
// when the flag flips back.
const staticVariants = (v: Variants) => ({
  variants: v,
  initial: "enter" as const,
  animate: "enter" as const,
  exit: "enter" as const,
  custom: null,
});

const Inner = forwardRef<HTMLDivElement, Props>(
  function Inner({ children, className, backgroundColor = "inherit" }, ref) {
    const skip = usePageTransitionSkip();
    const anim = (v: Variants) => (skip ? staticVariants(v) : variants(v));

    return (
      <div
        ref={ref}
        className={cn("relative z-[2]", className)}
        style={{ backgroundColor, zIndex: 2 }}
      >
        <motion.div
          className={cn(
            "h-dvh",
            "w-full",
            "fixed",
            "z-[6]",
            "left-0",
            "top-0",
            "bg-white"
          )}
          {...anim(slide)}
        />
        <motion.div className={"bg-white"} {...anim(perspective)}>
          <motion.div {...anim(opacity)}>{children}</motion.div>
        </motion.div>
      </div>
    );
  }
);

export default Inner;
