"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// A per-character masked reveal (the "flip" look): each line is an
// overflow-hidden mask, and its characters slide up from below into place —
// staggered one after another — then slide up and out on exit. Driven by
// `show`, so it plays in when a card snaps into place and out when it snaps
// away. Uppercase text keeps descenders out of the mask.
const DURATION = 0.4;
const STAGGER = 0.035;
const EASE = [0.33, 1, 0.68, 1] as const;

const lineVariants: Variants = {
  hidden: {},
  // `custom` is the line index — later lines start a beat after earlier ones.
  visible: (line = 0) => ({
    transition: { staggerChildren: STAGGER, delayChildren: 0.08 + line * 0.15 },
  }),
  exit: (line = 0) => ({
    transition: { staggerChildren: STAGGER, delayChildren: line * 0.05 },
  }),
};

const charVariants: Variants = {
  hidden: { y: "100%" },
  visible: { y: "0%", transition: { duration: DURATION, ease: EASE } },
  exit: { y: "-100%", transition: { duration: DURATION, ease: EASE } },
};

export interface RevealLine {
  text: string;
  className?: string;
}

interface Props {
  lines: RevealLine[];
  // When true the characters flip up into place; when false they flip up and out.
  show: boolean;
  className?: string;
}

export default function MaskedRevealText({ lines, show, className }: Props) {
  return (
    <div className={className}>
      <AnimatePresence initial={false}>
        {show &&
          lines.map((line, li) => (
            <motion.div
              key={li}
              custom={li}
              aria-label={line.text}
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn("overflow-hidden whitespace-nowrap", line.className)}
            >
              {line.text.split("").map((char, ci) => (
                <motion.span
                  key={ci}
                  aria-hidden
                  variants={charVariants}
                  className="inline-block will-change-transform"
                >
                  {char === " " ? " " : char}
                </motion.span>
              ))}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}
