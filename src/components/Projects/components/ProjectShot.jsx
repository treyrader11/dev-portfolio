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
import { SectionContext } from "@/lib/contexts";

export default function ProjectShot({
  index,
  progress,
  range,
  targetScale,
  project_image,
  video_key,
  category,
  title,
  isFirst = false,
  isLast = false,
  position,
}) {
  const container = useRef(null);

  const sectionContext = useContext(SectionContext);
  const { setActiveSection, setActiveSectionProgress } = sectionContext || {};
  // const { scrollYProgress } = useScroll({
  //   target: container,
  //   offset: ["start end", "start start"],
  // });

  // const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  // const scale = useTransform(progress, range, [1, targetScale]);

  // const { width } = useWindowDimensions();
  // const isMobile = width < 400;
  // const backgroundSize = isMobile ? "contain" : "cover";

  // Section scrollbar logic
  const { scrollYProgress } = useScroll({
    target: container,
    offset: isFirst
      ? ["start start", "end center"]
      : isLast
      ? ["start center", "end end"]
      : ["start center", "end center"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (
      value > 0 &&
      value < 1 &&
      setActiveSection &&
      setActiveSectionProgress
    ) {
      position?.positionId && setActiveSection(position?.positionId);
      setActiveSectionProgress(value);
    }
  });
  // Section scrollbar logic end

  return (
    <Link href={`/project/${video_key}`}>
      <div
        ref={container}
        style={{
          backgroundImage: `url(/shots/${project_image})`,
          backgroundPosition: "center",
          // backgroundSize,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          // top: `calc(-5vh + ${index * 25}px)`,
        }}
        className={cn(
          "h-screen",
          "flex",
          "items-center",
          "justify-center",
          "sticky",
          "top-0",
          "inset-x-0"
          // "shadow-xl",
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
