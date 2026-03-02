"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  height?: string | number | MotionValue<number>;
}

const PageCurve = forwardRef<HTMLDivElement, Props>(
  function PageCurve({ className, height }, ref) {
    return (
      <motion.div
        ref={ref}
        style={{ height }}
        className={cn(
          "bg-slate-100",
          "relative",
          // "pt-[100px]",
          "-mt-[2px]",
          className
        )}
      >
        <div
          className={cn(
            "h-[1550%]",
            "w-[120%]",
            "-left-[10%]",
            "rounded-bl-full",
            "rounded-br-full",
            "bg-slate-100",
            "z-[1]",
            "absolute",
            ""
          )}
        />
      </motion.div>
    );
  }
);

export default PageCurve;
