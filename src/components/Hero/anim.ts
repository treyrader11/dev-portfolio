import type { Variants } from "framer-motion";

export const slideUp: Variants = {
  initial: {
    y: "100%",
    transition: { duration: 0.5, delay: 5 },
  },
  open: (i: number) => ({
    y: "-100%",
    transition: { duration: 0.5, delay: 0.01 * i },
  }),
  closed: {
    y: "100%",
    transition: { duration: 0.5 },
  },
};
