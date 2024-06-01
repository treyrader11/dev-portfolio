"use client";

import { variants } from "@/lib/motion";
import { calcRandomBlockDelay, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { scaleIn, scaleOut, collapse } from "./anim";

export default function Collapse({ nbOfRows = 10, nbOfBlocks = 11, children }) {
  return (
    <>
      {/* transition in */}
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
        {Array.from(nbOfRows).map((_, rowIndex) => (
          // row
          <div key={rowIndex} className={cn("flex-1 w-full flex")}>
            {Array.from(nbOfBlocks).map((_, blockIndex) => (
              // block
              <motion.div
                {...variants(
                  collapse,
                  calcRandomBlockDelay(rowIndex, nbOfRows)
                )}
                key={blockIndex}
                className={cn(
                  "relative",
                  "flex-1",
                  "bg-dark-600",
                  "-m-[0.25px]",
                  "origin-top"
                )}
              />
            ))}
          </div>
        ))}
        {children}
      </div>
  
      {/* .transition out */}
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
        {Array.from(nbOfRows).map((_, rowIndex) => (
          // row
          <div key={rowIndex} className={cn("flex-1 w-full flex")}>
            {Array.from(nbOfBlocks).map((_, blockIndex) => (
              // block
              <motion.div
                key={blockIndex}
                {...variants(
                  collapse,
                  calcRandomBlockDelay(rowIndex, nbOfRows)
                )}
                className={cn(
                  "relative",
                  "flex-1",
                  "bg-dark-600",
                  "-m-[0.25px]",
                  "origin-bottom"
                )}
              />
            ))}
                
          </div>
        ))}
        
      </div>

    </>
  );
}
