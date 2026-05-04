import type { Transition } from "framer-motion";

export const SPRING_OPTIONS: Transition = {
  type: "spring" as const,
  mass: 3,
  stiffness: 400,
  damping: 50,
};
