"use client";

import { useScroll } from "framer-motion";
import React, { useRef } from "react";
import Project from "./components/Project";
import Rounded from "@/components/Rounded";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import PageTitle from "../PageTitle";
import Scrollbar from "../Scrollbar";
import { projectPositions, recentProjects } from "./constants";

export default function RecentProjects({ className }) {
  const container = useRef(null);


  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <motion.section
      ref={container}
      className={cn(
        "relative",
        "z-[2]",
        "mx-4",
        // "pb-[124vh]",
        "sm:pb-[160vh]",
        "flex",
        "flex-col",
        "gap-y-10",

        "snap-y",
        "snap-mandatory",
        "scroll-smooth",
        // "overflow-scroll",
        // "relative",
        // "-top-1/2",
        "sticky",
        // "snap-parent-y-mandatory",
        className
      )}
    >
      <PageTitle
        once={false}
        delay={0.8}
        backgroundColor="transparent"
        containerClass={cn(
          "h-0",
          "sticky",
          "top-0",

          // "md:p-0", //makes menu button look good
          "pt-10",
          "mt-[30%]", // puts title way at bottom
          "font-pp-acma"
        )}
        title="Recent projects."
        className={cn("py-0 md:text-[5vw]")}
      />

      <Scrollbar positions={projectPositions} />

      {/* Snap parent */}
      {/* <div className={cn("snap-parent-y-mandatory")}> */}
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
      {/* </div> */}

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

function SnapParent({ ...props }, ref) {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "snap-parent-y-mandatory"
        // "relative"
      )}
    >
      {props.children}
    </div>
  );
}

React.forwardRef(SnapParent);
