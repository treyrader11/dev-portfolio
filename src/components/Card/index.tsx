"use client";

import styles from "./styles";
import { cn } from "@/lib/utils";
import { motion, type MotionValue } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  className?: string;
  color?: string;
  scale?: MotionValue<number>;
  index?: number;
  isFolderShaped?: boolean;
}

export default function Card({
  children,
  className,
  color,
  scale,
  index = 0,
  isFolderShaped = false,
}: Props) {
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
