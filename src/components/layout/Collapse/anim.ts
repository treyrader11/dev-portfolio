import { calcRandomBlockDelay } from "@/lib/utils";
import type { Variants } from "framer-motion";

interface CollapseVariantResult {
  initial: { scaleY: number };
  exit: { scaleY: number };
  transition: {
    duration: number;
    delay: number;
    ease: number[];
  };
}

export const collapse: {
  animate: { scaleY: number };
  enter: (i: number) => CollapseVariantResult;
  exit: (i: number) => CollapseVariantResult;
} = {
  animate: {
    scaleY: 0,
  },
  enter: (i: number): CollapseVariantResult => ({
    initial: {
      scaleY: 1,
    },
    exit: { scaleY: 0 },
    transition: {
      duration: 1,
      delay: i,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: (i: number): CollapseVariantResult => ({
    initial: {
      scaleY: 0,
    },
    exit: { scaleY: 1 },
    transition: {
      duration: 1,
      delay: i,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

interface ScaleResult {
  initial: { scaleY: number };
  animate: { scaleY: number };
  exit: { scaleY: number };
  transition: {
    duration: number;
    ease: number[];
    delay: number;
  };
}

export const scale = (dir: string, i: number, numOfRows: number): ScaleResult => ({
  initial: {
    scaleY: dir === "in" ? 1 : 0,
  },
  animate: {
    scaleY: 0,
  },
  exit: {
    scaleY: dir === "in" ? 0 : 1,
  },
  transition: {
    duration: 1,
    ease: [0.22, 1, 0.36, 1],
    delay: calcRandomBlockDelay(i, numOfRows),
  },
});
