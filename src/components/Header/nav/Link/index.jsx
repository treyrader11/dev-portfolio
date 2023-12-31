"use client";

import NextLink from "next/link";
import { motion } from "framer-motion";
import styles from "./styles";
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
      className={cn(styles.link, className)}
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
        className={styles.indicator}
      />
      <NextLink href={href}>{label}</NextLink>
    </motion.div>
  );
}
