"use client";

import Link from "next/link";
import Image from "next/image";
import {
  useTransform,
  useMotionValueEvent,
  motion,
  useScroll,
} from "framer-motion";
import { useRef, useContext } from "react";
import { cn } from "@/lib/utils";
import Rounded from "@/components/Rounded";
import { PositionContext } from "@/lib/contexts";

export default function Project({
  index,
  progress,
  range,
  targetScale,
  project_image,
  video_key,
  category,
  title,
  position,
  overlap,
  className,
}) {
  const positionContainer = useRef(null);
  const positionContext = useContext(PositionContext);
  const { setActivePosition, setActivePositionProgress } =
    positionContext || {};

  const { scrollYProgress } = useScroll({
    target: positionContainer,
    offset: ["start center", "end center"],
  });

  const getTopPosition = (pos) =>
    overlap === "full" ? 0 : `calc(-5vh + ${pos * 25}px)`;

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (
      value > 0 &&
      value < 1 &&
      setActivePosition &&
      setActivePositionProgress
    ) {
      position?.positionId && setActivePosition(position?.positionId);
      setActivePositionProgress(value);
    }
  });
  // Position scrollbar logic end

  return (
    <Link href={`/project/${video_key}`} className={className}>
      <div
        ref={positionContainer}
        style={{
          backgroundImage: `url(/shots/${project_image})`,
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          top: getTopPosition(index),
        }}
        className={cn(
          "h-screen",
          "flex",
          "items-center",
          "justify-center",
          "sticky",
          "top-0",
          "inset-x-0",
          "z-[52]"
        )}
      >
        {/* <div className="relative size-full group">
          <ShotHoverOverlay
            projectId={video_key}
            title={title}
            category={category}
          />
        </div> */}
      </div>
    </Link>
  );
}

export function Shot({ src, width = 350, height = 350, marginRight = 30 }) {
  return (
    <div className={cn("w-[200px]")}>
      <div
        className="w-full border border-red-500 "
        style={{
          width,
          height,
          marginRight,
        }}
      >
        <motion.div className="relative size-full">
          <Image
            fill
            src={`/shots/${src}`}
            alt="image"
            className="object-fit lg:object-contain"
            sizes="(max-width: 900) 50vw"
          />
        </motion.div>
      </div>
    </div>
  );
}

function ShotHoverOverlay({ title, category, projectId, className }) {
  return (
    <div
      className={cn(
        "rounded-xl",
        "absolute",
        "top-1/2",
        "left-1/2",
        "group-hover:-translate-x-1/2",
        "group-hover:-translate-y-1/2",
        "bg-indigo-400",
        "backdrop-blur-md",

        "size-[calc(100%_-_2rem)]",
        "transition-all",
        "duration-[400]",
        "ease-in-out",
        "opacity-0",
        "group-hover:opacity-70",
        "overflow-hidden",
        "z-[99]",
        "w-[430px]",
        "h-[280px]",
        "text-white",

        "flex",
        "items-center",
        "justify-center",
        "flex-col",

        className
      )}
    >
      <div className={cn("p-8")}>
        <span
          className={cn(
            "absolute",
            "top-0",
            "left-[2rem]",
            "py-[0.2rem]",
            "px-[1em]",
            "border-b-2",
            "rounded-b-[10px]",
            "text-[clamp(1rem,1.5vw,1.2rem)]"
          )}
        >
          {category}
        </span>
        <h5 className="text-[clamp(1.5rem,2vw,2rem)] relative z-[50] mt-8">
          {title}
        </h5>
        {/* <div
          className={cn(
            "absolute",
            "mx-auto",
            "gap-8",
            "top-1/2",
            "left-1/2",
            "group-hover:-translate-y-1/2",
            "group-hover:-translate-x-[220px]",
            "scale-0",
            "transition-all",
            "duration-[400]",
            "ease-in-out",
            "opacity-0",
            "group-hover:scale-100",
            "group-hover:opacity-100"
          )}
        > */}
        <Rounded
          text="view"
          className={cn(
            "rounded-full",
            "p-8",
            // "flex",
            // "items-center",
            // "justify-center",
            // "transition-all",
            // "ease-in-out",
            // "duration-[400]",
            // "bg-dark-600",
            // "hover:bg-slate-400"
            "size-20",
            // "bg-transparent",
            "text-white",
            "fixed",
            "z-[3]",
            "flex",
            "items-center",
            "justify-center",
            "text-sm",
            "font-light"
          )}
          href={`/project/${projectId}`}
          target="_blank"
          rel="noreferrer"
        />
        {/* {icon1} */}

        {/* <Link
            className={cn(
              "size-[3.5rem]",
              "rounded-full",
              "flex",
              "items-center",
              "justify-center",
              "transition-all",
              "duration-[400]",
              "ease-in-out",
              "bg-dark-600",
              "hover:bg-slate-400"
            )}
            href={backend_download_link}
            target="_blank"
            rel="noreferrer"
          >
            {icon2}
          </Link> */}
        {/* </div> */}
      </div>
    </div>
  );
}
