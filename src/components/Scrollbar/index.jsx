"use client";

import { PositionContext } from "@/lib/contexts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useContext } from "react";

export default function Scrollbar({ positions, className }) {
  const positionContext = useContext(PositionContext);
  if (positionContext == null) return;

  const { activePosition, activePositionProgress } = positionContext;

  return (
    <motion.div
      className={cn(
        "sticky",
        "h-screen",
        "inset-0",
        "flex",
        "flex-col",
        "gap-2",
        "justify-center",
        className
      )}
    >
      {positions.map(({ positionId }) => (
        <motion.div
          key={positionId}
          layout
          transition={{ duration: 0.3 }}
          style={{
            height: activePosition == positionId ? "32px" : "8px",

            backgroundColor:
              activePosition == positionId
                ? "rgb(200,200,200)"
                : "rgb(82,82,82)",
            borderRadius: 9999,
          }}
          className="w-2 overflow-hidden"
        >
          {activePosition == positionId && (
            <motion.div
              style={{ height: `calc(${activePositionProgress * 200}% + 0px)` }} // set 200 instead of 100 since projectcards only scroll half way
              className="w-full bg-purple-400"
            />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
