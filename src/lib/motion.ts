import type { Variants } from "@/types/animation";

interface MotionProps {
  initial: string;
  animate: string;
  exit: string;
  custom: number | null;
  variants: Variants;
}

export const variants = (
  variants: Variants,
  custom: number | null = null
): MotionProps => {
  return {
    initial: "initial",
    animate: "enter",
    exit: "exit",
    custom,
    variants,
  };
};
