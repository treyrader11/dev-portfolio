"use client";

import { useScroll } from "framer-motion";
import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { projects } from "./projects.data";
import ProjectShot from "./components/ProjectShot";

export default function HomeProjects() {
  const container = useRef(null);

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
    <section ref={container} className="relative z-[2] sm:px-2 px-0">
      {projects.map((project, index) => {
        const targetScale = 1 - (projects.length - index) * 0.05;

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
    </section>
  );
}
