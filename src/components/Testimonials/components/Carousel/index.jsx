"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { testimonials } from "@/lib/data";
import ProfilePicture from "@/components/ProfilePicture";
import { Testimonial } from "../..";
import { SPRING_OPTIONS } from "../../anim";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 10;
const DRAG_BUFFER = 50;

export default function SwipeCarousel({ className }) {
  const [selected, setSelected] = useState(0);

  const dragX = useMotionValue(0);

  useEffect(() => {
    const intervalRef = setInterval(() => {
      const x = dragX.get();

      if (x === 0) {
        setSelected((pv) => {
          if (pv === testimonials.length - 1) {
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

    if (x <= -DRAG_BUFFER && selected < testimonials.length - 1) {
      setSelected((pv) => pv + 1);
    } else if (x >= DRAG_BUFFER && selected > 0) {
      setSelected((pv) => pv - 1);
    }
  };

  return (
    <div
      className={cn(
        "relative",
        "overflow-hidden",
        "py-8",
        "w-full",
        "mx-auto",
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
          translateX: `-${selected * 100}%`,
        }}
        transition={SPRING_OPTIONS}
        onDragEnd={onDragEnd}
        className={cn(
          "flex cursor-grab w-full items-center active:cursor-grabbing"
        )}
      >
        {/* <Images selected={selected} /> */}
        {testimonials.map((testimonial, index) => (
          <Testimonial
            key={index}
            {...testimonial}
            scale={selected === index ? 0.95 : 0.85}
            isSelected={selected == index}
          />
        ))}
      </motion.div>
      {/* <GradientArrows /> */}
      <Dots selected={selected} setSelected={setSelected} />
    </div>
  );
}

export function Dots({ selected, setSelected }) {
  return (
    <div className="flex justify-center w-full gap-2 mt-4">
      {testimonials.map((_, index) => {
        return (
          <button
            key={index}
            onClick={() => setSelected(index)}
            className={cn(
              "size-3",
              "rounded-full",
              "transition-colors",
              "border",
              "border-[1px]",
              "border-secondary",
              index === selected ? "bg-secondary" : "bg-transparent"
            )}
          />
        );
      })}
    </div>
  );
}

export function GradientArrows() {
  return (
    <>
      {/* <div
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
      /> */}

      <FaChevronRight
        className={cn(
          // "arrow",

          "absolute",
          "text-3xl",
          "cursor-pointer",
          "top-1/2",
          "-translate-y-1/2",
          "transition-all",
          "duration-300",
          "ease-in-out",
          "p-[5px]",
          "z-[10]",
          "right-2.5",
          "hover:text-purple-600",
          "before:cursor-pointer"
        )}
      />

      <FaChevronLeft
        className={cn(
          "absolute",
          "text-3xl",
          "cursor-pointer",
          "top-1/2",
          "-translate-y-1/2",
          "transition-all",
          "duration-300",
          "ease-in-out",
          "p-[5px]",
          "z-[10]",
          "left-2.5",
          "hover:text-purple-600",
          "before:cursor-pointer"
        )}
      />
    </>
  );
}
