"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";
import { cn, resolveImageSrc } from "@/lib/utils";
import PageCurve from "../PageCurve";
import type { SliderProject } from "@/features/portfolio/lib/projects";

interface Props {
  className?: string;
  // Project posters flagged as slider images, in sliderOrder. Managed in the
  // admin Projects page (the "Sliding Images" section + the per-project toggle).
  projects?: SliderProject[];
}

function SlideTile({ project, alt }: { project: SliderProject; alt: string }) {
  return (
    <div
      className={cn(
        "w-[25%]",
        "h-[20vw]",
        "flex",
        "items-center",
        "justify-center",
      )}
      style={{ backgroundColor: project.color }}
    >
      <div className={cn("relative size-4/5")}>
        <Image
          fill
          alt={alt}
          src={resolveImageSrc(project.poster)}
          className="object-cover"
          sizes="25vw"
          priority={project.isPriority}
        />
      </div>
    </div>
  );
}

export default function SlidingImages({ className, projects = [] }: Props) {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const height = useTransform(scrollYProgress, [0, 0.9], [50, 0]);

  // Only posters that actually have an image; split across the two opposing rows
  // (evens on top, odds on the bottom) so the strip stays balanced.
  const usable = projects.filter((p) => p.poster);
  const row1 = usable.filter((_, i) => i % 2 === 0);
  const row2 = usable.filter((_, i) => i % 2 === 1);

  return (
    <div
      ref={container}
      className={cn(
        "flex",
        "flex-col",
        "gap-[3vw]",
        "relative",
        "bg-white",
        "z-[1]",
        "py-10",
        "sm:py-20",
        className,
      )}
    >
      <motion.div
        style={{ x: x1 }}
        className={cn(
          "flex",
          "relative",
          "gap-[3vw]",
          "w-[120vw]",
          "-left-[10vw]",
        )}
      >
        {row1.map((project, index) => (
          <SlideTile key={index} project={project} alt={project.title} />
        ))}
      </motion.div>
      <motion.div
        style={{ x: x2 }}
        className={cn(
          "flex",
          "relative",
          "gap-[3vw]",
          "w-[120vw]",
          "-left-[10vw]",
        )}
      >
        {row2.map((project, index) => (
          <SlideTile key={index} project={project} alt={project.title} />
        ))}
        <PageCurve height={height} />
      </motion.div>
    </div>
  );
}
