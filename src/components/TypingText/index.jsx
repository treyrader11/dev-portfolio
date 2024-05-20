"use client";

import { motion } from "framer-motion";
import { textContainer, textVariant } from "./anim";
import { cn } from "@/lib/utils";

export default function TypingText({ text, className }) {
  return (
    <motion.p
      variants={textContainer}
      className={cn(
        "font-normal",
        "text-[14px]",
        "text-secondary-white",
        className
      )}
    >
      {Array.from(text).map((letter, index) => (
        <motion.span variants={textVariant} key={index}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.p>
  );
}
