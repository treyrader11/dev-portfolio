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
import { positions as projPositions } from "./positions.data";

export default function RecentProjects({ className }) {
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <motion.section
      ref={container}
      className={cn("relative z-[2] pb-28 mx-3", className)}
    >
      <PageTitle
        backgroundColor="transparent"
        containerClass="h-0"
        title="Recent projects."
        className={cn("top-16")}
      />

      <Scrollbar positions={projPositions} />

      {projectsData.map((project, index) => {
        const targetScale = 1 - (projectsData.length - index) * 0.05;
        return (
          <Project
            position={projPositions[index]}
            isLast={index > projectsData.length}
            key={`p_${index}`}
            index={index}
            {...project}
            progress={scrollYProgress}
            range={[index * 0.25, 1]}
            targetScale={targetScale}
          />
        );
      })}
      <div className="-mt-40">
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
            "-top-50",
            "sm:top-0",
            "md:top-20",
            "lg:top-32",
            "text-black"
          )}
        />
      </div>
    </motion.section>
  );
}
