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

  const hasProjects = projects.length > 0;
  const { scrollYProgress: lastProjectProgress } = useScroll({
    target: hasProjects ? lastProjectRef : container,
    offset: ["start end", "start start"],
  });

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

  const { scrollYProgress: exitProgress } = useScroll({
    target: container,
    offset: ["end end", "end start"],
  });
  // Very tight [0, 0.06] range so the title snaps out almost the instant the
  // last project starts scrolling up — a fast fade, not a gradual one.
  const titleOpacity = useTransform(exitProgress, [0, 0.06], [1, 0]);
  const titleY = useTransform(exitProgress, [0, 0.06], [0, -40]);

  // Purple position dots fade out on the same fast range as the title.
  const scrollbarOpacity = useTransform(exitProgress, [0, 0.06], [1, 0]);

  return (
    <motion.section
      ref={container}
      className={cn(
        "relative",
        "z-[2]",
        "mx-4",
        "pb-[8vh]",
        "flex",
        "flex-col",
        "gap-y-10",
        "sticky",
        className,
      )}
    >
      <motion.div
        style={{ opacity: titleOpacity, y: titleY }}
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

      <motion.div
        aria-hidden
        style={{ opacity: hintOpacity }}
        className="pointer-events-none sticky top-[32vh] z-30 flex justify-center sm:top-[16vh]"
      >
        <ScrollDownIndicator />
      </motion.div>

      <motion.div style={{ opacity: scrollbarOpacity }}>
        <Scrollbar positions={projectPositions} />
      </motion.div>

      {projects.map((project, i) => {
        const isLast = i === projects.length - 1;
        return (
          <React.Fragment key={i}>
            {isLast && (
              <div
                ref={lastProjectRef}
                aria-hidden
                // relative (not static) so framer-motion's useScroll can measure
                // this target's offset correctly — silences the "container has a
                // non-static position" console warning. h-0, so no visual change.
                className="relative h-0 -mb-10"
              />
            )}
            <div data-snap-anchor aria-hidden className="h-0" />
            <LatestWorkFlipCard
              project={project}
              position={projectPositions[i]}
            />
          </React.Fragment>
        );
      })}

      <div aria-hidden className="h-[60vh]" />

      <div className={cn("relative", "z-20", "pb-24")}>
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
          )}
        />
      </div>
    </motion.section>
  );
}
