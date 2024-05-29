"use client";

import Link from "next/link";
import Image from "next/image";
import {
  useTransform,
  useMotionValueEvent,
  motion,
  useScroll,
} from "framer-motion";
import { useRef, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import Rounded from "@/components/Rounded";
import { PositionContext } from "@/lib/contexts";
import blank_shot from "/public/shots/blank-shot.png";
import { useRouter } from "next/navigation";
// import blank_shot from "/blank-shot.png";

export default function Project({
  index,
  progress,
  range,
  targetScale,
  project_image,
  video_key,
  category,
  title,
  position,
  overlap,
  className,
}) {
  const positionContainer = useRef(null);
  const positionContext = useContext(PositionContext);
  const { setActivePosition, setActivePositionProgress } =
    positionContext || {};

  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const router = useRouter();

  const handleFlip = () => {
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  };

  const { scrollYProgress } = useScroll({
    target: positionContainer,
    offset: ["start center", "end center"],
  });

  const getTopPosition = (pos) =>
    overlap === "full" ? 0 : `calc(-5vh + ${pos * 25}px)`;

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
  // Position scrollbar logic end

  return (
    <a
      style={{ perspective: 1000 }}
      ref={positionContainer}
      className={cn(
        "cursor-pointer",
        "sticky",
        "top-0",
        "h-screen",
        "flex",
        className
      )}
      onClick={handleFlip}
    >
      {/* <CardFlip
        imageSrc={`/shots/${project_image}`}
        style={{ top: getTopPosition(index) }}
      />

      <CardFlip
        imageSrc={blank_shot.src}
        style={{ top: getTopPosition(index) }}
        className={cn("rotate-[100deg]")}
      >
        <Rounded
          text="View Project"
          backgroundColor="purple"
          className={cn(
            "p-6",
            "text-white",
            "bg-purple-400",
            "rounded-full",
            "size-fit"
          )}
          href={`/project/${video_key}`}
        />
      </CardFlip> */}
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
          top: getTopPosition(index),
        }}
        className={cn(
          "h-screen",
          "flex",
          "items-center",
          "justify-center",
          "sticky",
          "inset-x-0",
          "z-[52]",
          "w-[120%]"
        )}
      />

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
          top: getTopPosition(index),
        }}
        onClick={handleFlip}
        className={cn(
          "transition-transform",
          "duration-[600]",
          "h-screen",
          "fixed",
          "inset-x-0",
          "flex",
          "items-center",
          "flex-col",
          "justify-center",
          "rotate-[100deg]"
        )}
      >
        <Rounded
          text="View Project"
          backgroundColor="purple"
          className={cn(
            "p-6",
            "text-white",
            "bg-purple-400",
            "rounded-full",
            "size-fit"
          )}
          href={`/project/${video_key}`}
        />
      </motion.div>
    </a>
  );
}

function CardFlip({ className, imageSrc, children, style }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  };

  return (
    <motion.div
      initial={false}
      animate={{ rotateY: isFlipped ? 180 : 360 }}
      transition={{ duration: 0.6, animationDirection: "normal" }}
      onAnimationComplete={() => setIsAnimating(false)}
      style={{
        ...style,
        transition: "transform 0.6s",
        backgroundImage: `url(${imageSrc})`,
        backgroundPosition: "center",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backfaceVisibility: "hidden",
        // top,
      }}
      onClick={handleFlip}
      className={cn(
        "h-screen",
        "flex",
        "items-center",
        "justify-center",
        "sticky",
        "inset-x-0",
        "z-[52]",
        "w-[120%]",
        className
      )}
    >
      {children}
    </motion.div>
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
