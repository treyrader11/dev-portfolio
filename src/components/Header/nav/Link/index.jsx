"use client";

import NextLink from "next/link";
import { motion } from "framer-motion";
import { scale, slide } from "../../anim";
import { cn } from "@/lib/utils";

export default function Link({
  data,
  isActive,
  setSelectedIndicator,
  className,
}) {
  const { label, href, index } = data;

  return (
    <motion.div
      className={cn("relative", "flex", "items-center", className)}
      onMouseEnter={() => {
        setSelectedIndicator(href);
      }}
      custom={index}
      variants={slide}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <motion.div
        variants={scale}
        animate={isActive ? "open" : "closed"}
        className={cn(
          "w-[10px]",
          // "w-fit",
          "h-[10px]",
          "bg-white",
          "rounded-full",
          "absolute",
          "-left-[30px]"
        )}
      />
      <NextLink href={href}>{label}</NextLink>
    </motion.div>
  );
}
