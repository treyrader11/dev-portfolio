"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import React, { useRef, useMemo } from "react";
import LatestWorkFlipCard from "@/components/latest-work-flip-card";
import ScrollDownIndicator from "@/components/scroll-down-indicator";
import Rounded from "@/components/Rounded";
import { cn, createScrollPositions } from "@/lib/utils";
import PageTitle from "../PageTitle";
import Scrollbar from "../Scrollbar";
import type { ProjectData } from "@/types/data";

interface Props {
  className?: string;
  projects: ProjectData[];
}

export default function LatestWork({ className, projects }: Props) {
  const container = useRef<HTMLElement>(null);
  const lastProjectRef = useRef<HTMLDivElement>(null);

  const projectPositions = useMemo(
    () => createScrollPositions(projects),
    [projects],
  );

  // Track the last project relative to the viewport: progress reaches 1 when its
  // top edge meets the top of the screen — i.e. when it touches the sticky title.
  // Element-based, so it stays accurate across every screen size. Falls back to
  // the section ref when there are no projects so the target is always hydrated.
  const hasProjects = projects.length > 0;
  const { scrollYProgress: lastProjectProgress } = useScroll({
    target: hasProjects ? lastProjectRef : container,
    offset: ["start end", "start start"],
  });

  // Title stays visible until the last card reaches it, then fades out.
  const titleOpacity = useTransform(lastProjectProgress, [0.7, 0.92], [1, 0]);

  const titleY = useTransform(lastProjectProgress, [0.7, 0.92], [0, -30]);

  // "scroll down" hint: fade it in shortly after the section sticks (just after
  // the title), then fade it out as the last work item is reached.
  const { scrollYProgress: sectionProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });
  const hintFadeIn = useTransform(sectionProgress, [0.03, 0.12], [0, 1]);
  const hintFadeOut = useTransform(lastProjectProgress, [0.6, 0.85], [1, 0]);
  const hintOpacity = useTransform(
    [hintFadeIn, hintFadeOut],
    ([i, o]: number[]) => Math.min(i, o),
  );

  return (
    <motion.section
      ref={container}
      className={cn(
        "relative",
        "z-[2]",
        "mx-4",
        "pb-[20vh]",
        "sm:pb-[60vh]",
        "flex",
        "flex-col",
        "gap-y-10",
        "snap-y",
        "snap-mandatory",
        "scroll-smooth",
        "sticky",
        className,
      )}
    >
      <motion.div
        style={{
          opacity: titleOpacity,
          y: titleY,
        }}
        className={cn(
          "sticky",
          "top-0",
          "pt-14",
          "mt-[30%]",
          "pointer-events-none",
          "mx-auto",
        )}
      >
        <PageTitle
          once={false}
          delay={0.8}
          backgroundColor="transparent"
          containerClass={cn("h-0", "font-pp-acma")}
          title="Latest Work."
          className={cn("py-0 md:text-[5vw]")}
        />
      </motion.div>

      {/* "scroll down" hint — pinned midway between the title and the work card,
          independent of the title block so it never overlaps the title on mobile.
          Floats above the cards (z-30) and ignores pointer events. */}
      <motion.div
        aria-hidden
        style={{ opacity: hintOpacity }}
        className="pointer-events-none sticky top-[32vh] z-30 flex justify-center"
      >
        <ScrollDownIndicator />
      </motion.div>

      <Scrollbar positions={projectPositions} />

      {projects.map((project, i) => {
        const isLast = i === projects.length - 1;
        return (
          <React.Fragment key={i}>
            {/* Sentinel marks the top of the last project for the title fade */}
            {isLast && (
              <div ref={lastProjectRef} aria-hidden className="h-0 -mb-10" />
            )}
            <LatestWorkFlipCard project={project} position={projectPositions[i]} />
          </React.Fragment>
        );
      })}

      <div className={cn("relative", "z-20", "py-20 sm:py-0")}>
        <Rounded
          backgroundColor="#934e00"
          text="See all projects"
          href="/portfolio"
          className={cn(
            "border-secondary",
            "rounded-full",
            "w-fit",
            "mx-auto",
            "py-6",
            "text-black",
            "mt-[-10rem]",
            "sm:-mt-0",
          )}
        />
      </div>
    </motion.section>
  );
}
