"use client";

import styles from "./styles";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Card({
  children,
  className,
  color,
  scale,
  index,
  isFolderShaped = false,
}) {
  return (
    <motion.div
      style={{
        backgroundColor: color,
        scale,
        top: `calc(-5vh + ${index * 25}px)`,
      }}
      className={cn(styles.card(isFolderShaped), className)}
    >
      {children}
    </motion.div>
  );
}
