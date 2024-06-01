import { calcRandomBlockDelay } from "@/lib/utils";

export const collapse = {
  animate: {
    scaleY: 0,
  },
  enter: (i) => ({
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
  exit: (i) => ({
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

export const scale = (dir, i, numOfRows) => ({
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
