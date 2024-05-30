"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function PageCurve({ className, height }, ref) {
  return (
    <motion.div
      ref={ref}
      style={{ height }}
      className={cn(
        "bg-white relative",
        // "pt-[100px]",
        "-mt-[2px]",
        className
      )}
    >
      <div
        className={cn(
          "h-[1550%]",
          //   "h-[1300%]",
          "w-[120%]",

          "-left-[10%]",
          "rounded-tl-none",
          "rounded-tr-none",
          "rounded-bl-full",
          "rounded-br-full",
          "bg-white",
          "z-[1]",
          "absolute",
          ""
        )}
      />
    </motion.div>
  );
}

export default forwardRef(PageCurve);
