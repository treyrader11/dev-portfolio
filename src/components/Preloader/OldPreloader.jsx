"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { opacity, slideUp } from "./anim";
import { cn } from "@/lib/utils";

const words = [
  "Hello",
  "Bonjour",
  "Ciao",
  "Olà",
  "やあ",
  "Hallå",
  "Guten tag",
  "Hallo",
];

const styles = {
  introduction: cn(
    "h-screen",
    "w-screen",
    "flex",
    "items-center",
    "justify-center",
    "fixed",
    "z-[99]",
    "bg-dark"
  ),
  svg: cn("absolute", "top-0", "w-full", "h-[calc(100%+300px)]"),
  path: "fill-dark",
  p: cn("flex", "text-white", "text-6xl", "items-center", "absolute", "z-10"),
  span: cn(
    "block",
    "w-[10px]",
    "h-[10px]",
    "bg-white",
    "rounded-[50%]",
    "mr-[10px]"
  ),
};

export default function Preloader() {
  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    if (index == words.length - 1) return;
    setTimeout(
      () => {
        setIndex(index + 1);
      },
      index == 0 ? 1000 : 150
    );
  }, [index]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height + 300} 0 ${
    dimension.height
  }  L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height}  L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
    },
  };

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      className={styles.introduction}
    >
      {dimension.width > 0 && (
        <>
          <motion.p
            className={styles.p}
            variants={opacity}
            initial="initial"
            animate="enter"
          >
            <span className={styles.span}></span>
            {words[index]}
          </motion.p>
          <svg>
            <motion.path
              className={styles.path}
              variants={curve}
              initial="initial"
              exit="exit"
            ></motion.path>
          </svg>
        </>
      )}
    </motion.div>
  );
}
