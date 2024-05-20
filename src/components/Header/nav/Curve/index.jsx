"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Curve() {
  let initialPath;
  let targetPath;

  if (typeof window !== "undefined") {
    initialPath = `M100 0 L100 ${window.innerHeight} Q-100 ${
      window.innerHeight / 2
    } 100 0`;
    targetPath = `M100 0 L100 ${window.innerHeight} Q100 ${
      window.innerHeight / 2
    } 100 0`;
  }

  const curve = {
    initial: {
      d: initialPath,
    },
    enter: {
      d: targetPath,
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: initialPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
  };

  return (
    <svg
      className={cn(
        "absolute",
        "top-0",
        "-left-[99px]",
        "w-[100px]",
        "h-full",
        "stroke-none",
        "fill-dark-700"
      )}
    >
      <motion.path
        variants={curve}
        initial="initial"
        animate="enter"
        exit="exit"
      ></motion.path>
       {/* <motion.path
        variants={curve}
        initial="initial"
        animate="enter"
        exit="exit"
      /> */}
    </svg>
  );
}
