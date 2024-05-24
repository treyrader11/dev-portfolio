"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import useMeasure from "react-use-measure";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Shot } from "../RecentProjects/components/Project";
import { cn } from "@/lib/utils";
// import { CourseCard } from "./Courses/CourseCard";

const styles = {
  container: cn("overflow-hidden", "relative"),
};

const CARD_WIDTH = 350;
const CARD_HEIGHT = 350;
const MARGIN = 20;
const CARD_SIZE = CARD_WIDTH + MARGIN;

const BREAKPOINTS = {
  sm: 640,
  lg: 1024,
};

export default function Carousel({ items, children }) {
  const [offset, setOffset] = useState(0);
  const [ref, { width }] = useMeasure();
  console.log("items", items);
  const CARD_BUFFER =
    width > BREAKPOINTS.lg ? 3 : width > BREAKPOINTS.sm ? 2 : 1;

  const CAN_SHIFT_LEFT = offset < 0;

  const CAN_SHIFT_RIGHT =
    Math.abs(offset) < CARD_SIZE * (items.length - CARD_BUFFER);

  const shiftLeft = () => {
    if (!CAN_SHIFT_LEFT) {
      return;
    }
    setOffset((pv) => (pv += CARD_SIZE));
  };

  const shiftRight = () => {
    if (!CAN_SHIFT_RIGHT) {
      return;
    }
    setOffset((pv) => (pv -= CARD_SIZE));
  };

  return (
    <section ref={ref}>
      <div className={styles.container}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            animate={{
              x: offset,
            }}
            className="flex"
          >
            {items.map((item, index) => (
              <Shot
                key={index}
                src={item.src}
                // scale={item.scale}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                marginRight={MARGIN}
              />
            ))}
          </motion.div>
        </div>

        {/* BUTTONS */}
        <>
          <motion.button
            initial={false}
            animate={{
              x: CAN_SHIFT_LEFT ? "0%" : "-100%",
            }}
            className={cn(
              "absolute",
              "left-0",
              "top-[60%]",
              "z-30",
              "rounded-r-xl",
              "bg-slate-100/30",
              "p-3",
              "pl-2",
              "text-4xl",
              "text-white",
              "backdrop-blur-sm",
              "transition-[padding]",
              "hover:pl-3"
            )}
            onClick={shiftLeft}
          >
            <FiChevronLeft />
          </motion.button>
          <motion.button
            initial={false}
            animate={{
              x: CAN_SHIFT_RIGHT ? "0%" : "100%",
            }}
            className={cn(
              "absolute",
              "right-0",
              "top-[60%]",
              "z-30",
              "rounded-l-xl",
              "bg-slate-100/30",
              "p-3",
              "pr-2",
              "text-4xl",
              "text-white",
              "backdrop-blur-sm",
              "transition-[padding]",
              "hover:pr-3"
            )}
            onClick={shiftRight}
          >
            <FiChevronRight />
          </motion.button>
        </>
      </div>
    </section>
  );
}
