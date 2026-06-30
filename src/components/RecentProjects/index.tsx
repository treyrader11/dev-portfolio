"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import React, { useRef } from "react";
import Project from "./components/Project";
import Rounded from "@/components/Rounded";
import { cn } from "@/lib/utils";
import PageTitle from "../PageTitle";
import Scrollbar from "../Scrollbar";
import { projectPositions, recentProjects } from "./constants";

interface Props {
  className?: string;
}

export default function RecentProjects({ className }: Props) {
  const container = useRef<HTMLElement>(null);
  const lastProjectRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // Track the last project relative to the viewport: progress reaches 1 when its
  // top edge meets the top of the screen — i.e. when it touches the sticky title.
  // Element-based, so it stays accurate across every screen size.
  const { scrollYProgress: lastProjectProgress } = useScroll({
    target: lastProjectRef,
    offset: ["start end", "start start"],
  });

  // Title stays visible until the last card reaches it, then fades out.
  const titleOpacity = useTransform(
    lastProjectProgress,
    [0.7, 0.92],
    [1, 0]
  );

  const titleY = useTransform(lastProjectProgress, [0.7, 0.92], [0, -30]);

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
        className
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
          "mx-auto"
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

      <Scrollbar positions={projectPositions} />

      {recentProjects.map((project, i) => {
        const isLast = i === recentProjects.length - 1;
        return (
          <React.Fragment key={i}>
            {/* Sentinel marks the top of the last project for the title fade */}
            {isLast && (
              <div ref={lastProjectRef} aria-hidden className="h-0 -mb-10" />
            )}
            <Project
              position={projectPositions[i]}
              {...project}
              progress={scrollYProgress}
            />
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
            "sm:-mt-0"
          )}
        />
      </div>
    </motion.section>
  );
}
