"use client";

import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
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

// Stack transition: forward, the incoming slide slides in from the right on top
// of the current one (which stays put and gets covered); backward, the current
// slide slides off to the right to reveal the previous one beneath. This mirrors
// the vertical project-card stacking (cover / uncover) instead of a track slide.
const stackVariants: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "0%", zIndex: dir > 0 ? 2 : 1 }),
  center: (dir: number) => ({ x: "0%", zIndex: dir > 0 ? 2 : 1 }),
  exit: (dir: number) => ({ x: dir > 0 ? "0%" : "100%", zIndex: dir > 0 ? 1 : 2 }),
};

interface CarouselProps {
  /** Slide content — pass any node (e.g. an image rendered with next/image). */
  slides: ReactNode[];
  className?: string;
  /** Transition style. `slide` = native horizontal scroll-snap track (default).
   *  `stack` = incoming slide covers / outgoing uncovers, like the card stack. */
  variant?: "slide" | "stack";
  /** Overlay the controls over the slide (arrows on the sides, dots on top)
   *  instead of laying them out below it. */
  overlayControls?: boolean;
  /** Positions (Tailwind inset classes) for the overlaid controls. */
  prevClassName?: string;
  nextClassName?: string;
  dotsClassName?: string;
}

// Global reusable carousel. `slide` mode uses native horizontal scroll-snap so
// slides snap on swipe and when the controls scroll to them. `stack` mode swaps
// that for a cover/uncover transition matching the vertical project-card stack.
// In `overlayControls` mode the arrows sit on the slide's left/right (each shown
// only when a slide exists that way, fading in/out) and the dots sit on top.
export function Carousel({
  slides,
  className,
  variant = "slide",
  overlayControls,
  prevClassName,
  nextClassName,
  dotsClassName,
}: CarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);
  // Direction of the last transition (1 = forward, -1 = back) — drives the stack.
  const [dir, setDir] = useState(1);
  const count = slides.length;
  const isStack = variant === "stack";

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setCurrent((c) => (c === index ? c : index));
  };

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(count - 1, index));
    if (isStack) {
      setDir(clamped >= current ? 1 : -1);
      setCurrent(clamped);
      return;
    }
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  };

  const goPrev = () => goTo(current - 1);
  const goNext = () => goTo(current + 1);
  const hasPrev = current > 0;
  const hasNext = current < count - 1;

  if (count === 0) return null;

  const slideTrack = (
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

  const stackTrack = (
    <div className="relative w-full overflow-hidden">
      {/* Invisible sizer reserves one slide's height (all slides share size). */}
      <div className="invisible" aria-hidden>
        {slides[0]}
      </div>
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={current}
          custom={dir}
          variants={stackVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {slides[current]}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  const track = isStack ? stackTrack : slideTrack;

  const dots = (
    <div className="flex items-center gap-1.5">
      {slides.map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          onClick={(e) => {
            e.stopPropagation();
            goTo(i);
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
