"use client";

import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useRef, useState, type ReactNode } from "react";
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

// Global reusable carousel: native horizontal scroll-snap, so slides snap into
// place on swipe and when the prev/next controls scroll to them. In
// `overlayControls` mode the arrows sit on the slide's left/right (each shown
// only when a slide exists that way, fading in/out) and the dots sit on top.
export function Carousel({
  slides,
  className,
  overlayControls,
  prevClassName,
  nextClassName,
  dotsClassName,
}: CarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);
  const count = slides.length;

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setCurrent((c) => (c === index ? c : index));
  };

  const scrollToIndex = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  };

  const goPrev = () => scrollToIndex(Math.max(0, current - 1));
  const goNext = () => scrollToIndex(Math.min(count - 1, current + 1));
  const hasPrev = current > 0;
  const hasNext = current < count - 1;

  if (count === 0) return null;

  const track = (
    <ul
      ref={trackRef}
      onScroll={handleScroll}
      className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {slides.map((slide, index) => (
        <li
          key={index}
          className="flex w-full shrink-0 snap-center items-center justify-center"
        >
          {slide}
        </li>
      ))}
    </ul>
  );

  const dots = (
    <div className="flex items-center gap-1.5">
      {slides.map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          onClick={(e) => {
            e.stopPropagation();
            scrollToIndex(i);
          }}
          className={cn(
            "h-1.5 rounded-full transition-all",
            i === current ? "w-5 bg-secondary" : "w-1.5 bg-neutral-400/80",
          )}
        />
      ))}
    </div>
  );

  if (overlayControls) {
    return (
      <div className={cn("relative w-full", className)}>
        {track}

        {count > 1 && (
          <>
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
