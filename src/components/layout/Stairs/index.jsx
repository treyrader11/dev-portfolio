"use client";

import { motion } from "framer-motion";
import { opacity, expand } from "./anim";
import { cn } from "@/lib/utils";
import { variants } from "@/lib/motion";

export default function Stairs({ children, backgroundColor = "#292929" }) {
  const nbOfColumns = 5;
  return (
    <div className="page stairs" style={{ backgroundColor }}>
      {/* Background */}
      <motion.div
        {...variants(opacity)}
        className={cn(
          "fixed",
          "w-full",
          "h-screen",
          "z-[50]",
          "pointer-events-none",
          "top-0",
          "left-0"
        )}
      />
      <div
        className={cn(
          "fixed",
          "w-screen",
          "h-screen",
          "flex",
          "left-0",
          "top-0",
          "pointer-events-none",
          "z-[99]"
        )}
      >
        {[...Array(nbOfColumns)].map((_, i) => {
          return (
            <motion.div
              className={cn("relative size-full bg-dark-600")}
              key={i}
              {...variants(expand, nbOfColumns - i)}
            />
          );
        })}
      </div>
      {children}
    </div>
  );
}
