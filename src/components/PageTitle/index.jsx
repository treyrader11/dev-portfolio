"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { slideIn } from "./anim";
import TypingText from "../TypingText";

export default function PageTitle({ className, backgroundColor, title }) {
  return (
    <div
      style={{ backgroundColor }}
      className={cn("h-48 mx-auto bg-dark-400 px-6")}
    >
      {/* <motion.h1
        initial="hidden"
        whileInView="show"
        // viewport={{ once: true, amount: 0.25 }}
        variants={slideIn("right", "tween", 1, 1)}
        className={cn(
          "py-[125px]",
          "sm:py-[130px]",
          // "py-[20em]",
          "md:py-[110px]",
          // "py-[2.6em]",
          // "text-6xl",
          "text-7xl",
          "font-bold",
          "text-center",
          "md:text-left",
          "text-left",
          "md:text-9xl",
          "text-secondary",
          "animate-slideright2",
          className
        )}
      > */}
      <TypingText
        text={title}
        className={cn(
          "py-[125px]",
          "sm:py-[130px]",
          // "py-[20em]",
          "md:py-[110px]",
          // "py-[2.6em]",
          // "text-6xl",
          "text-7xl",
          "font-bold",
          "text-center",
          "md:text-left",
          "text-left",
          "md:text-9xl",
          "text-secondary",
          "animate-slide-up",
          className
        )}
      >
        {title}
      </TypingText>
    </div>
  );
}
