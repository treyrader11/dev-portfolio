"use client";

import { useScroll } from "framer-motion";
import { useRef, useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import ProjectShot from "./components/ProjectShot";
import Rounded from "@/components/Rounded";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { projectsData } from "@/lib/data";
import PageTitle from "../PageTitle";
import Scrollbar from "./components/Scrollbar";

export const positions = [
  // {
  //   positionId: 0,
  // },
  {
    positionId: 1,
  },
  {
    positionId: 2,
  },
  {
    positionId: 3,
  },
  {
    positionId: 4,
  },
  {
    positionId: 5,
  },

];

export default function Projects({ className }) {
  const container = useRef(null);

  const router = useRouter();

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // useEffect(() => {
  //   const lenis = new Lenis();

  //   function raf(time) {
  //     lenis.raf(time);
  //     requestAnimationFrame(raf);
  //   }

  //   requestAnimationFrame(raf);
  // });

  return (
    <motion.section
      ref={container}
      className={cn("relative z-[2] pb-28", "mx-3", className)}
    >
      <PageTitle
        backgroundColor="transparent"
        title="Recent projects."
        className={cn("top-16")}
      />

      <Scrollbar positions={positions} />

      {projectsData.map((project, index) => {
        const targetScale = 1 - (projectsData.length - index) * 0.05;
        return (
          <ProjectShot
            position={positions[index]}
            isFirst={index === 1}
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
