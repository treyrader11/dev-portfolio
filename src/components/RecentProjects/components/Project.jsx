"use client";

import Image from "next/image";
import { useMotionValueEvent, motion, useScroll } from "framer-motion";
import { useRef, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import Rounded from "@/components/Rounded";
import { PositionContext } from "@/lib/contexts";
import blank_shot from "/public/shots/blank-shot.png";

export default function Project({
  project_image,
  video_key,
  position,
  className,
}) {
  const container = useRef(null); // for position context
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

  // scrollbar/position logic
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
      position?.positionId && setActivePosition(position?.positionId);
      setActivePositionProgress(value);
    }
  });
  // Position scrollbar/position logic end

  return (
    <div
      style={{ perspective: 1000 }}
      ref={container}
      className={cn(
        "cursor-pointer",
        "sticky",
        "top-0",
        "min-h-screen",
        className
      )}
      onClick={handleFlip}
    >
      {/* Front of card */}
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 360 }}
        transition={{ duration: 0.6, animationDirection: "normal" }}
        onAnimationComplete={() => setIsAnimating(false)}
        style={{
          transition: "transform 0.6s",
          backgroundImage: `url(/shots/${project_image})`,
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backfaceVisibility: "hidden",
        }}
        className={cn(
          "h-screen",
          "fixed", // need to take ele out of page flow for width to work
          "w-[120%]",
          "-left-[calc(20%-10%)]" // 10% === 1/2 of 20%
        )}
      />
      {/* Back of card */}
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 360 : 180 }}
        transition={{ duration: 0.6, animationDirection: "normal" }}
        onAnimationComplete={() => setIsAnimating(false)}
        style={{
          transition: "transform 0.6s",
          backgroundImage: `url(${blank_shot.src})`,
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backfaceVisibility: "hidden",
        }}
        onClick={handleFlip}
        className={cn(
          "h-screen",
          "flex",
          "items-center",
          "flex-col",
          "justify-center",
          "rotate-[100deg]",
          "fixed",
          "inset-x-0",
          "w-[120%]",
          "-left-[10%]" // 10% === 1/2 of 20%
        )}
      >
        <Rounded
          text="View"
          backgroundColor="purple"
          className={cn("bg-purple-400", "p-4", "absolute")}
          href={`/project/${video_key}`}
        />
      </motion.div>
    </div>
  );
}

export function Shot({ src, width = 350, height = 350, marginRight = 30 }) {
  return (
    <div className={cn("w-[200px]")}>
      <div
        className="w-full border border-red-500 "
        style={{
          width,
          height,
          marginRight,
        }}
      >
        <motion.div className="relative size-full">
          <Image
            fill
            src={`/shots/${src}`}
            alt="image"
            className="object-fit lg:object-contain"
            sizes="(max-width: 900) 50vw"
          />
        </motion.div>
      </div>
    </div>
  );
}
