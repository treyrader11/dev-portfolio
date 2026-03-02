"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import React, { useRef, useMemo } from "react";
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

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // Calculate when to fade based on number of projects
  const fadeStartPoint = useMemo(() => {
    const projectCount = recentProjects.length;
    // Start fading 20% earlier (subtract 0.2)
    return Math.max(0.65, 1 - 2 / projectCount - 0.2);
  }, []);

  // Title stays visible until last card, then fades out sooner
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, fadeStartPoint, fadeStartPoint + 0.1, 1],
    [1, 1, 0, 0]
  );

  const titleY = useTransform(
    scrollYProgress,
    [fadeStartPoint, fadeStartPoint + 0.1],
    [0, -30]
  );

  return (
    <motion.section
      ref={container}
      className={cn(
        "relative",
        "z-[2]",
        "mx-4",
        "sm:pb-[160vh]",
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
          title="Recent projects."
          className={cn("py-0 md:text-[5vw]")}
        />
      </motion.div>

      <Scrollbar positions={projectPositions} />

      {recentProjects.map((project, i) => {
        return (
          <Project
            position={projectPositions[i]}
            key={i}
            {...project}
            progress={scrollYProgress}
          />
        );
      })}

      <div className={cn("py-20 sm:py-0")}>
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
