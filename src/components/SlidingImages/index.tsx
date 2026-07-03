"use client";

import { useRef } from "react";
import {
  useScroll,
  useTransform,
  motion,
  type MotionValue,
} from "framer-motion";
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

// Each tile is ~25% of the 120vw track, so ~4 tiles fill one row. Fewer images
// than that stay a single row; every extra ~4 adds another row.
const PER_ROW = 4;

function SlideTile({ project }: { project: SliderProject }) {
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
          alt={project.title}
          src={resolveImageSrc(project.poster)}
          className="object-cover"
          sizes="25vw"
          priority={project.isPriority}
        />
      </div>
    </div>
  );
}

// One horizontal row. Each row drifts a different distance and direction as you
// scroll, so the rows never move in lockstep.
function SlideRow({
  items,
  progress,
  index,
}: {
  items: SliderProject[];
  progress: MotionValue<number>;
  index: number;
}) {
  const dir = index % 2 === 0 ? 1 : -1;
  const distance = 130 + (index % 3) * 55; // 130 / 185 / 240, repeating
  const x = useTransform(progress, [0, 1], [0, dir * distance]);

  return (
    <motion.div
      style={{ x }}
      className={cn(
        "flex",
        "relative",
        "gap-[3vw]",
        "w-[120vw]",
        "-left-[10vw]",
        "justify-center",
      )}
    >
      {items.map((project, i) => (
        <SlideTile key={i} project={project} />
      ))}
    </motion.div>
  );
}

export default function SlidingImages({ className, projects = [] }: Props) {
  const container = useRef<HTMLDivElement>(null);

  // Drive the bottom curve off the slider's *bottom edge* crossing the
  // viewport: it's a full dome while that edge sits at the fold (footer still
  // below), and flattens to a straight divider line as you scroll the last
  // screen and the footer comes fully into view.
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["end end", "end start"],
  });
  const height = useTransform(scrollYProgress, [0, 1], [60, 0]);

  // Only posters that actually have an image, chunked into rows of PER_ROW.
  const usable = projects.filter((p) => p.poster);
  const rows: SliderProject[][] = [];
  for (let i = 0; i < usable.length; i += PER_ROW) {
    rows.push(usable.slice(i, i + PER_ROW));
  }

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
        // A little breathing room above the rows; only a small, constant gap
        // below them (independent of row count) so the curve sits right against
        // the footer rather than floating in empty white space.
        "pt-10",
        "sm:pt-20",
        "pb-4",
        className,
      )}
    >
      {rows.map((row, i) => (
        <SlideRow key={i} items={row} progress={scrollYProgress} index={i} />
      ))}
      <PageCurve height={height} />
    </div>
  );
}
