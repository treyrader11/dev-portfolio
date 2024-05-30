"use client";

import { calcRandomBlockDelay, cn } from "@/lib/utils";
import { motion } from "framer-motion";

// export default function Transition(Page) {
export default function Transition({ children }) {
  return (
    <>
      {/* <Page /> */}
      {children}

      <div
        className={cn(
          "fixed",
          "inset-0",
          "flex",
          "flex-col",
          "z-[999]",
          "pointer-events-none"
        )}
      >
        {Array.from({ length: 10 }).map((_, rowIndex) => (
          // .row
          <div key={rowIndex} className={cn("flex-1", "w-full", "flex")}>
            {Array.from({ length: 11 }).map((_, blockIndex) => (
              // .block
              <motion.div
                key={blockIndex}
                className={cn(
                  "relative",
                  "flex-1",
                  "bg-dark-600",
                  "-m-[0.25px]",
                  "origin-top"
                )}
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                exit={{ scaleY: 0 }}
                transition={{
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                  delay: calcRandomBlockDelay(rowIndex, 10),
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* .transition-out.blocks-container */}
      <div
        className={cn(
          "fixed",
          "top-0",
          "left-0",
          "w-screen",
          "h-screen",
          "flex",
          "flex-col",
          "pointer-events-none"
        )}
      >
        {Array.from({ length: 10 }).map((_, rowIndex) => (
          // .row
          <div key={rowIndex} className={cn("flex-1", "w-full", "flex")}>
            {Array.from({ length: 11 }).map((_, blockIndex) => (
              // .block
              <motion.div
                key={blockIndex}
                className={cn(
                  "relative",
                  "flex-1",
                  "bg-dark-600",
                  "-m-[0.25px]",
                  "origin-bottom"
                )}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 0 }}
                exit={{ scaleY: 1 }}
                transition={{
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                  delay: calcRandomBlockDelay(rowIndex, 10),
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
