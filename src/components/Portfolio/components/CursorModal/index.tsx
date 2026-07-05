"use client";

import type { RefObject } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn, resolveImageSrc } from "@/lib/utils";
import { scaleAnimation } from "../../anim";
import type { ProjectData } from "@/types/data";

interface Props {
  projects: ProjectData[];
  active: boolean;
  index: number;
  modalContainer: RefObject<HTMLDivElement | null>;
  cursor: RefObject<HTMLDivElement | null>;
  cursorLabel: RefObject<HTMLDivElement | null>;
}

// The cursor-following pieces (card + dot + "View" label) from the awwwards
// original, themed to this site. Rendered by the Portfolio only when a real
// pointer is present, so it never shows on touch screens. Positions are driven
// externally by gsap (see useCursorModal); scaleAnimation pops each piece in on
// hover and centers it on the cursor via the -50% x/y offset.
export default function CursorModal({
  projects,
  active,
  index,
  modalContainer,
  cursor,
  cursorLabel,
}: Props) {
  const state = active ? "enter" : "closed";

  return (
    <>
      {/* The white card. Its inner slider translates vertically so the hovered
          project's poster is the one in view (top: index * -100%). */}
      <motion.div
        ref={modalContainer}
        variants={scaleAnimation}
        initial="initial"
        animate={state}
        className={cn(
          "pointer-events-none fixed left-1/2 top-1/2 z-50",
          "h-[300px] w-[380px] overflow-hidden rounded-lg bg-white shadow-2xl",
        )}
      >
        <div
          style={{ top: index * -100 + "%" }}
          className={cn(
            "relative size-full transition-[top] duration-500",
            "[transition-timing-function:cubic-bezier(0.76,0,0.24,1)]",
          )}
        >
          {projects.map((project, i) => (
            <div
              key={i}
              style={{ backgroundColor: project.color }}
              className="flex size-full items-center justify-center"
            >
              <div className="relative size-full">
                <Image
                  src={resolveImageSrc(project.project_image, "/images")}
                  alt=""
                  fill
                  sizes="380px"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* The colored cursor dot. */}
      <motion.div
        ref={cursor}
        variants={scaleAnimation}
        initial="initial"
        animate={state}
        className={cn(
          "pointer-events-none fixed z-50 flex size-20 items-center",
          "justify-center rounded-full bg-secondary",
        )}
      />

      {/* The "View" label, sharing the dot's center. */}
      <motion.div
        ref={cursorLabel}
        variants={scaleAnimation}
        initial="initial"
        animate={state}
        className={cn(
          "pointer-events-none fixed z-50 flex size-20 items-center",
          "justify-center rounded-full bg-transparent text-sm font-light",
          "text-white",
        )}
      >
        View
      </motion.div>
    </>
  );
}
