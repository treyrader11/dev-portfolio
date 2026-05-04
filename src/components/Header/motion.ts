import type { Variants } from "framer-motion";

const ease = [0.76, 0, 0.24, 1] as const;

export const menuSlide: Variants = {
  initial: { x: "calc(100% + 100px)" },
  enter: { x: "0", transition: { duration: 0.8, ease } },
  exit: {
    x: "calc(100% + 100px)",
    transition: { duration: 0.8, ease },
  },
};

export const slide: Variants = {
  initial: { x: 80 },
  enter: (i: number) => ({
    x: 0,
    transition: { duration: 0.8, ease, delay: 0.05 * i },
  }),
  exit: (i: number) => ({
    x: 80,
    transition: { duration: 0.8, ease, delay: 0.05 * i },
  }),
};

export const scale: Variants = {
  open: { scale: 1, transition: { duration: 0.3 } },
  closed: { scale: 0, transition: { duration: 0.4 } },
};

export const slideDown: Variants = {
  hidden: {
    opacity: 0,
    y: -50,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 140,
    },
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      delay: 1,
    },
  },
};

export const blur: Variants = {
  initial: { filter: "blur(4px)" },
  enter: {
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      delay: 0.25,
    },
  },
  exit: {
    filter: "blur(4px)",
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      delay: 0.25,
    },
  },
};
