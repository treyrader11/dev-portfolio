"use client";

import { motion } from "framer-motion";
import { slide, opacity, perspective } from "./anim";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { variants } from "@/lib/motion";

function Inner({ children, className, backgroundColor = "inherit" }, ref) {
  return (
    <div
      ref={ref}
      className={cn("relative z-[2]", className)}
      style={{ backgroundColor, zIndex: 2 }}
    >
      <motion.div
        className={cn(
          "h-screen",
          "w-full",
          "fixed",
          "z-[6]",
          "left-0",
          "top-0",
          "bg-white"
        )}
        {...variants(slide)}
      />
      <motion.div className={"bg-white"} {...variants(perspective)}>
        <motion.div {...variants(opacity)}>{children}</motion.div>
      </motion.div>
    </div>
  );
}

export default forwardRef(Inner);
