"use client";

import { useScroll } from "framer-motion";
import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { projects } from "./projects.data";
import Project from "./components/Project";

export default function Projects() {
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
    <section
      ref={container}
      className="relative mt-[20vh] z-[2] px-2"
    >
      {projects.map((project, index) => {
        const targetScale = 1 - (projects.length - index) * 0.05;
        return (
          <Project
            key={`p_${index}`}
            index={index}
            {...project}
            progress={scrollYProgress}
            range={[index * 0.25, 1]}
            targetScale={targetScale}
            // isFolderShaped
          />
        );
      })}
    </section>
  );
}
