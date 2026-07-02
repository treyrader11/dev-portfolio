"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { PositionContext } from "@/lib/contexts";
import LatestWorkCardFront from "./latest-work-card-front";
import LatestWorkCardBack from "./latest-work-card-back";
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
export default function LatestWorkFlipCard({
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

  // True only when this card is pinned at the top of the viewport (i.e. snapped
  // into position) and scrolling has settled — used to reveal the carousel
  // controls only on the project that's locked in place.
  const [snapped, setSnapped] = useState(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const check = () => {
      const el = container.current;
      if (!el) return;
      setSnapped(Math.abs(el.getBoundingClientRect().top) < 8);
    };
    const onScroll = () => {
      setSnapped(false); // hide controls while moving
      clearTimeout(timer);
      timer = setTimeout(check, 160); // re-check once the scroll settles
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    check();
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

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
      // Snap target: the home page registers these with Lenis Snap so each card
      // locks to the top of the viewport as you scroll.
      data-snap-project
      className={cn(
        "z-10",
        "w-full",
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "min-h-screen",
        "snap-start",
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
          <LatestWorkCardFront project={project} showControls={snapped} />
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
          "fixed",
          "w-[120%]",
          "-left-[calc(20%_-_10%)]",
          "flex",
          "items-center",
          "justify-center",
        )}
      >
        {/* Same sized wrapper as the front so the mockup overlaps exactly. */}
        <div className="relative w-[min(94vw,90vh)] sm:w-[62%] max-w-[900px]">
          <LatestWorkCardBack project={project} />
        </div>
      </motion.div>
    </div>
  );
}
