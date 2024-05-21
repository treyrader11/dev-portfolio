"use client";

import { motion } from "framer-motion";
import { slide, opacity, perspective } from "./anim";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const styles = {
  inner: ({ className }) => cn("bg-black", className),
  page: cn("bg-white"),
  slide: cn(
    "h-screen",
    "w-full",
    "fixed",
    "z-[6]",
    "left-0",
    "top-0",
    "bg-white"
  ),
};

const anim = (variants) => {
  return {
    initial: "initial",
    animate: "enter",
    exit: "exit",
    variants,
  };
};

function Inner({ children, className, backgroundColor = "inherit" }, ref) {
  return (
    <div
      ref={ref}
      className={styles.inner({ className })}
      style={{ backgroundColor, zIndex: 2, position: "relative" }}
    >
      <motion.div className={styles.slide} {...anim(slide)} />
      <motion.div className={"bg-white"} {...anim(perspective)}>
        <motion.div {...anim(opacity)}>{children}</motion.div>
      </motion.div>
    </div>
  );
}

export default forwardRef(Inner);
