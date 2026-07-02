"use client";

import { useContext, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { PositionContext } from "@/lib/contexts";
import ProjectCardFront from "./project-card-front";
import ProjectCardBack from "./project-card-back";
import type { ProjectData } from "@/types/data";
import type { ScrollPosition } from "@/types/components";

interface Props {
  project: ProjectData;
  className?: string;
  // Optional: preserves the section's Scrollbar active-position tracking when
  // rendered inside the Latest Work list.
  position?: ScrollPosition;
}

// The single flippable project card dropped into any page. Front is a laptop
// mockup of the screenshot; back is the "View" button. The sticky container,
// scroll-position tracking, and flip timing/easing are preserved from the
// original Latest Work card.
export default function ProjectFlipCard({
  project,
  className,
  position,
}: Props) {
  const container = useRef<HTMLDivElement>(null);

  const positionContext = useContext(PositionContext);
  const { setActivePosition, setActivePositionProgress } =
    positionContext || {};

  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  };

  // Scrollbar/position tracking — unchanged from the original card.
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start center", "end center"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (
      value > 0 &&
      value < 1 &&
      setActivePosition &&
      setActivePositionProgress
    ) {
      position?.positionId && setActivePosition(position.positionId);
      setActivePositionProgress(value);
    }
  });

  return (
    <div
      style={{ perspective: 1000 }}
      ref={container}
      className={cn(
        "z-10",
        "w-full",
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "min-h-screen",
        "sticky",
        "top-0",
        "cursor-pointer",
        className,
      )}
      onClick={handleFlip}
    >
      {/* Front of card */}
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 360 }}
        transition={{ duration: 0.6 }}
        onAnimationComplete={() => setIsAnimating(false)}
        style={{ transition: "transform 0.6s", backfaceVisibility: "hidden" }}
        className={cn(
          "h-screen",
          "fixed",
          "w-[120%]",
          "-left-[calc(20%_-_10%)]",
          "flex",
          "items-center",
          "justify-center",
        )}
      >
        {/* Mobile: as large as possible, capped by both viewport dimensions so
            the square frame never overflows. Desktop keeps its smaller size. */}
        <div className="w-[min(94vw,90vh)] sm:w-[62%] max-w-[900px]">
          <ProjectCardFront project={project} />
        </div>
      </motion.div>

      {/* Back of card */}
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 360 : 180 }}
        transition={{ duration: 0.6 }}
        onAnimationComplete={() => setIsAnimating(false)}
        style={{ transition: "transform 0.6s", backfaceVisibility: "hidden" }}
        onClick={handleFlip}
        className={cn(
          "h-screen",
          "rotate-[100deg]",
          "fixed",
          "inset-x-0",
          "w-[120%]",
          "-left-[10%]",
        )}
      >
        <ProjectCardBack project={project} />
      </motion.div>
    </div>
  );
}
