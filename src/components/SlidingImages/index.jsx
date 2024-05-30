"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";
import { slider1, slider2 } from "./sliders";
import { cn } from "@/lib/utils";
import PageCurve from "../PageCurve";

export default function SlidingImages({ className }) {
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const height = useTransform(scrollYProgress, [0, 0.9], [50, 0]);

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
        "py-20",
        // "mt-20",
        className
      )}
    >
      <motion.div
        style={{ x: x1 }}
        className={cn(
          "flex",
          "relative",
          "gap-[3vw]",
          "w-[120vw]",
          "-left-[10vw]"
        )}
      >
        {slider1.map((project, index) => {
          return (
            <div
              key={index}
              className={cn(
                "w-[25%]",
                "h-[20vw]",
                "flex",
                "items-center",
                "justify-center"
              )}
              style={{ backgroundColor: project.color }}
            >
              <div className={cn("relative size-4/5")}>
                <Image
                  fill
                  alt="image"
                  src={`/images/${project.src}`}
                  className="object-cover"
                  sizes={{}}
                />
              </div>
            </div>
          );
        })}
      </motion.div>
      <motion.div
        style={{ x: x2 }}
        className={cn(
          "flex",
          "relative",
          "gap-[3vw]",
          "w-[120vw]",
          "-left-[10vw]"
        )}
      >
        {slider2.map((project, index) => {
          return (
            <div
              key={index}
              className={cn(
                "w-[25%]",
                "h-[20vw]",
                "flex",
                "items-center",
                "justify-center"
              )}
              style={{ backgroundColor: project.color }}
            >
              <div key={index} className={cn("relative size-4/5")}>
                <Image
                  fill={true}
                  alt="image"
                  src={`/images/${project.src}`}
                  priority={project.isPriority}
                  sizes={{}}
                />
              </div>
            </div>
          );
        })}
        <PageCurve height={height} />
      </motion.div>

      {/* <div className={cn("bg-white h-[5vh]")} /> */}
      {/* <PageCurve height={height} /> */}
    </div>
  );
}
