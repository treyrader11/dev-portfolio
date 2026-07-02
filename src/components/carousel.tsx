"use client";

import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CarouselControlProps {
  type: "previous" | "next";
  title: string;
  handleClick: () => void;
}

function CarouselControl({ type, title, handleClick }: CarouselControlProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border-2 border-transparent bg-neutral-200 transition duration-200 hover:-translate-y-0.5 focus:border-[#6D64F7] focus:outline-none active:translate-y-0.5 dark:bg-neutral-800",
        type === "previous" && "rotate-180",
      )}
      title={title}
      onClick={(e) => {
        // Never let a control click bubble to a parent (e.g. a flip-card click).
        e.stopPropagation();
        handleClick();
      }}
    >
      <IconArrowNarrowRight className="text-neutral-600 dark:text-neutral-200" />
    </button>
  );
}

interface CarouselProps {
  /** Slide content — pass any node (e.g. an image rendered with next/image). */
  slides: ReactNode[];
  className?: string;
  /** Overlay the controls over the slide (arrows on the sides, dots on top)
   *  instead of laying them out below it. */
  overlayControls?: boolean;
  /** Positions (Tailwind inset classes) for the overlaid controls. */
  prevClassName?: string;
  nextClassName?: string;
  dotsClassName?: string;
}

// Global reusable carousel: horizontal scroll with prev/next controls and dot
// indicators. In `overlayControls` mode the arrows sit on the left/right of the
// slide (each shown only when a slide exists that way and fading in/out as you
// navigate) and the dots sit over the top.
export function Carousel({
  slides,
  className,
  overlayControls,
  prevClassName,
  nextClassName,
  dotsClassName,
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const count = slides.length;
  if (count === 0) return null;

  const goPrev = () => setCurrent((c) => Math.max(0, c - 1));
  const goNext = () => setCurrent((c) => Math.min(count - 1, c + 1));
  const hasPrev = current > 0;
  const hasNext = current < count - 1;

  const dots = (
    <div className="flex items-center gap-1.5">
      {slides.map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          onClick={(e) => {
            e.stopPropagation();
            setCurrent(i);
          }}
          className={cn(
            "h-1.5 rounded-full transition-all",
            i === current ? "w-5 bg-secondary" : "w-1.5 bg-neutral-400/80",
          )}
        />
      ))}
    </div>
  );

  const track = (
    <div className="overflow-hidden">
      <ul
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <li
            key={index}
            className="flex w-full shrink-0 items-center justify-center"
          >
            {slide}
          </li>
        ))}
      </ul>
    </div>
  );

  if (overlayControls) {
    return (
      <div className={cn("relative w-full", className)}>
        {track}

        {count > 1 && (
          <>
            {/* Left arrow — only when a slide exists to the left. */}
            <AnimatePresence>
              {hasPrev && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "absolute z-50",
                    prevClassName ?? "left-4 top-1/2 -translate-y-1/2",
                  )}
                >
                  <CarouselControl
                    type="previous"
                    title="Go to previous slide"
                    handleClick={goPrev}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right arrow — only when a slide exists to the right. */}
            <AnimatePresence>
              {hasNext && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "absolute z-50",
                    nextClassName ?? "right-4 top-1/2 -translate-y-1/2",
                  )}
                >
                  <CarouselControl
                    type="next"
                    title="Go to next slide"
                    handleClick={goNext}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dots — overlaid above the slide. */}
            <div
              className={cn(
                "absolute z-50 flex justify-center rounded-full bg-black/30 px-2 py-1 backdrop-blur-sm",
                dotsClassName ?? "top-4 left-1/2 -translate-x-1/2",
              )}
            >
              {dots}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
      {track}
      {count > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <CarouselControl
            type="previous"
            title="Go to previous slide"
            handleClick={goPrev}
          />
          {dots}
          <CarouselControl
            type="next"
            title="Go to next slide"
            handleClick={goNext}
          />
        </div>
      )}
    </div>
  );
}
