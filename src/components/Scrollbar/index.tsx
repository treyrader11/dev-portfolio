"use client";

import { PositionContext } from "@/lib/contexts";
import { cn } from "@/lib/utils";
import { motion, type MotionValue } from "framer-motion";
import { useContext } from "react";
import type { ScrollPosition } from "@/types";

interface Props {
  positions: ScrollPosition[];
  // Fade driven by the parent (0 until the first project enters view, 0 on exit).
  opacity?: MotionValue<number> | number;
  className?: string;
}

export default function Scrollbar({ positions, opacity, className }: Props) {
  const positionContext = useContext(PositionContext);
  if (positionContext == null) return null;

  const { activePosition, activePositionProgress } = positionContext;

  return (
    // Fixed and vertically centered: the dots stay pinned to the middle of the
    // viewport and never scroll. Visibility is controlled purely by opacity.
    <div
      className={cn(
        "pointer-events-none",
        "fixed",
        "left-4",
        "top-1/2",
        "z-30",
        "-translate-y-1/2",
        className,
      )}
    >
      <motion.div style={{ opacity }} className="flex flex-col gap-2">
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
                style={{ height: `calc(${activePositionProgress * 200}% + 0px)` }} // 200 not 100 since project cards only scroll half way
                className="w-full bg-purple-400"
              />
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
