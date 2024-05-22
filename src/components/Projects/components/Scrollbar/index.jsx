"use client";

import { SectionContext } from "@/lib/contexts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useContext } from "react";

export default function Scrollbar({ positions, className }) {
  const sectionContext = useContext(SectionContext);
  if (sectionContext == null) return;

  const { activeSection, activeSectionProgress } = sectionContext;

  return (
    <motion.div
      className={cn(
        "sticky",
        // "right-10",
        "h-screen",
        "inset-y-0",
        // "start-0",
        "inset-x-0",
        "flex",
        "flex-col",
        "gap-2",
        "justify-center",
        "z-[50]",
        className
      )}
    >
      {positions.map(({ positionId }) => (
        <motion.div
          key={positionId}
          layout
          transition={{ duration: 0.3 }}
          style={{
            height: activeSection == positionId ? "32px" : "8px",

            backgroundColor:
              activeSection == positionId
                ? "rgb(200,200,200)"
                : "rgb(82,82,82)",
            borderRadius: 9999,
          }}
          className="w-2 overflow-hidden"
        >
          {activeSection == positionId && (
            <motion.div
              style={{ height: `calc(${activeSectionProgress * 200}% + 0px)` }} // set 200 instead of 100 since projectcards only scroll half way
              className="w-full bg-pink-500"
            />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
