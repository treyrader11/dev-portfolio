import type { Transition } from "framer-motion";

export const SPRING_OPTIONS: Transition = {
  type: "spring",
  mass: 3,
  stiffness: 400,
  damping: 50,
};
