"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  /** The hint label. Defaults to "scroll down". */
  text?: string;
  className?: string;
}

// Reusable animated scroll hint: the label drifts downward and fades in a loop.
// Horizontally centered. Drop it anywhere; gate its visibility with a wrapper
// (e.g. a scroll-driven opacity) when needed.
export default function ScrollDownIndicator({
  text = "scroll down",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center overflow-hidden",
        className,
      )}
    >
      <motion.p
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: "100%", opacity: 0.5 }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: [0.3, 0.86, 0.36, 0.95],
        }}
        className="opacity-50 text-secondary"
      >
        {text}
      </motion.p>
    </div>
  );
}
