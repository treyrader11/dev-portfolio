"use client";

import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, type ReactNode } from "react";
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
        "mx-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-transparent bg-neutral-200 transition duration-200 hover:-translate-y-0.5 focus:border-[#6D64F7] focus:outline-none active:translate-y-0.5 dark:bg-neutral-800",
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
  /** Overlay the controls over the slide instead of laying them out below it,
   *  so they stay anchored to each slide. */
  overlayControls?: boolean;
  /** Position of the overlay controls (Tailwind inset classes). Defaults to the
   *  bottom-right corner. */
  overlayClassName?: string;
}

// Global reusable carousel: horizontal scroll with prev/next controls and dot
// indicators. Behavior mirrors the reference implementation (translateX by the
// current index, looping controls); slide content is arbitrary.
export function Carousel({
  slides,
  className,
  overlayControls,
  overlayClassName,
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const count = slides.length;
  if (count === 0) return null;

  const goPrev = () => setCurrent((c) => (c - 1 < 0 ? count - 1 : c - 1));
  const goNext = () => setCurrent((c) => (c + 1 === count ? 0 : c + 1));

  return (
    <div className={cn("relative w-full", className)}>
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

      {count > 1 && (
        <div
          className={cn(
            "flex items-center gap-2",
            overlayControls
              ? // Anchored over the slide, above everything.
                cn(
                  "absolute z-50 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm",
                  overlayClassName ?? "bottom-3 right-3",
                )
              : "mt-4 justify-center gap-3",
          )}
        >
          <CarouselControl
            type="previous"
            title="Go to previous slide"
            handleClick={goPrev}
          />

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
                  i === current ? "w-5 bg-secondary" : "w-1.5 bg-neutral-400",
                )}
              />
            ))}
          </div>

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
