"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { testimonials } from "@/lib/data";

const imgs = [
  "/imgs/nature/1.jpg",
  "/imgs/nature/2.jpg",
  "/imgs/nature/3.jpg",
  "/imgs/nature/4.jpg",
  "/imgs/nature/5.jpg",
  "/imgs/nature/6.jpg",
  "/imgs/nature/7.jpg",
];

const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 10;
const DRAG_BUFFER = 50;

const SPRING_OPTIONS = {
  type: "spring",
  mass: 3,
  stiffness: 400,
  damping: 50,
};

export default function SwipeCarousel({ className }) {
  const [imgIndex, setImgIndex] = useState(0);

  const dragX = useMotionValue(0);

  useEffect(() => {
    const intervalRef = setInterval(() => {
      const x = dragX.get();

      if (x === 0) {
        setImgIndex((pv) => {
          if (pv === imgs.length - 1) {
            return 0;
          }
          return pv + 1;
        });
      }
    }, AUTO_DELAY);

    return () => clearInterval(intervalRef);
  }, []);

  const onDragEnd = () => {
    const x = dragX.get();

    if (x <= -DRAG_BUFFER && imgIndex < imgs.length - 1) {
      setImgIndex((pv) => pv + 1);
    } else if (x >= DRAG_BUFFER && imgIndex > 0) {
      setImgIndex((pv) => pv - 1);
    }
  };

  return (
    <div
      className={cn(
        "relative",
        "overflow-hidden",
        "bg-neutral-950",
        "py-8",
        className
      )}
    >
      <motion.div
        drag="x"
        dragConstraints={{
          left: 0,
          right: 0,
        }}
        style={{
          x: dragX,
        }}
        animate={{
          translateX: `-${imgIndex * 100}%`,
        }}
        transition={SPRING_OPTIONS}
        onDragEnd={onDragEnd}
        className={cn("flex cursor-grab items-center active:cursor-grabbing")}
      >
        <Images imgIndex={imgIndex} />
      </motion.div>

      <Dots imgIndex={imgIndex} setImgIndex={setImgIndex} />
      <GradientEdges />
    </div>
  );
}

export function Images({ imgIndex }) {
  return (
    <>
      {testimonials.map((tes, idx) => {
        return (
          <motion.div
            key={idx}
            style={{
              backgroundImage: `url(${tes.image_url.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            animate={{
              scale: imgIndex === idx ? 0.95 : 0.85,
            }}
            transition={SPRING_OPTIONS}
            className={cn(
              "aspect-video",
              "w-screen",
              "shrink-0",
              "rounded-xl",
              "bg-neutral-800",
              "object-cover"
            )}
          />
        );
      })}
    </>
  );
}

export function Dots({ imgIndex, setImgIndex }) {
  return (
    <div className="flex justify-center w-full gap-2 mt-4">
      {testimonials.map((_, idx) => {
        return (
          <button
            key={idx}
            onClick={() => setImgIndex(idx)}
            className={cn(
              "size-3 rounded-full transition-colors",
              idx === imgIndex ? "bg-neutral-50" : "bg-neutral-500"
            )}
          />
        );
      })}
    </div>
  );
}

export function GradientEdges() {
  return (
    <>
      <div
        className={cn(
          "pointer-events-none",
          "absolute",
          "inset-y-0",
          "left-0",
          "w-[10vw]",
          "max-w-[100px]",
          "bg-gradient-to-r",
          "from-neutral-950/50",
          "to-neutral-950/0"
        )}
      />

      <div
        className={cn(
          "pointer-events-none",
          "absolute",
          "inset-y-0",
          "right-0",
          "w-[10vw]",
          "max-w-[100px]",
          "bg-gradient-to-r",
          "from-neutral-950/50",
          "to-neutral-950/0"
        )}
      />
    </>
  );
}
