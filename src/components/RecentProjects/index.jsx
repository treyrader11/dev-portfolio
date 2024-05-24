"use client";

import { useScroll } from "framer-motion";
import { useRef } from "react";
import Project from "./components/Project";
import Rounded from "@/components/Rounded";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { projectsData } from "@/lib/data";
import PageTitle from "../PageTitle";
import Scrollbar from "../Scrollbar";
import { projectPositions } from "./constants";

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
        "min-h-screen",
        "z-[2]",
        "mx-4",
        "pb-[124vh]",
        className
      )}
    >
      {/* <PageTitle
        backgroundColor="transparent"
        containerClass="h-0"
        title="Recent projects."
        className={cn("top-16")}
      /> */}

      {/* <Scrollbar positions={projectPositions} /> */}

      <div className="sticky">
      <PageTitle
        backgroundColor="transparent"
        containerClass="h-0 sticky -top-[20%]"
        title="Recent work."
        className={cn("top-16")}
      />
        <Scrollbar positions={projectPositions} />

        {projectsData.map((project, index) => {
          const targetScale = 1 - (projectsData.length - index) * 0.05;
          return (
            <Project
              position={projectPositions[index]}
              isLast={index > projectsData.length}
              key={`p_${index}`}
              index={index}
              {...project}
              progress={scrollYProgress}
              range={[index * 0.25, 1]}
              targetScale={targetScale}
              overlap="full"
            />
          );
        })}

        <div className="pt-[20vh] sm:pt-[30vh] relative">
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
              "-mt-28"
            )}
          />
        </div>
      </div>
    </motion.section>
  );
}
