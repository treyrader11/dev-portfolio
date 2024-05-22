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

export default function Projects({ scrollYP, className }) {
  const container = useRef(null);

  const router = useRouter();

  // const scale = useTransform(scrollYP, [0, 1], [1, 0.8]);
  // const rotate = useTransform(scrollYP, [0, 1], [0, -5]);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  });

  return (
    <motion.section
      // style={{ scale, rotate }}
      ref={container}
      className={cn("relative z-[2] sm:px-2 px-0", className)}
    >
      {projectsData.map((project, index) => {
        const targetScale = 1 - (projectsData.length - index) * 0.05;
        return (
          <ProjectShot
            key={`p_${index}`}
            index={index}
            {...project}
            progress={scrollYProgress}
            range={[index * 0.25, 1]}
            targetScale={targetScale}
          />
        );
      })}

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
    </motion.section>
  );
}
