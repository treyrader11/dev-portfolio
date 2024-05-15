"use client";

import Image from "next/image";
import { useTransform, motion, useScroll } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";

export default function ProjectShot({
  index,
  title,
  description,
  src,
  url,
  color,
  progress,
  range,
  targetScale,
  // isFolderShaped = false,
  manageModal,
}) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  const { width } = useWindowDimensions();
  const isMobile = width < 400;
  const backgroundSize = isMobile ? "contain" : "cover";

  return (
    <div
      ref={container}
      onMouseEnter={(e) => {
        manageModal(true, index, e.clientX, e.clientY);
      }}
      onMouseLeave={(e) => {
        manageModal(false, index, e.clientX, e.clientY);
      }}
      style={{
        backgroundImage: `url(/shots/${src})`,
        backgroundPosition: "center",
        backgroundSize,
        backgroundRepeat: "no-repeat",
        top: `calc(-5vh + ${index * 25}px)`,
      }}
      className={cn(
        "h-screen",
        "flex",
        "items-center",
        "justify-center",
        "sticky",
        "top-0",
        "inset-x-0"
      )}
    />
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
        <motion.div className="size-full">
          <Image
            fill
            src={`/shots/${src}`}
            alt="image"
            className="object-cover lg:object"
            sizes="(max-width: 900) 50vw"
          />
        </motion.div>
      </div>
    </div>
  );
}
