"use client";

import { cn, slugify, resolveImageSrc } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { RiArrowRightUpLine } from "react-icons/ri";
import Tags from "./Tags";
import { motion } from "framer-motion";
import { useEffect, useState, type RefObject } from "react";
import type { MotionValue } from "framer-motion";

interface MousePosition {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

interface Props {
  index: number;
  title: string;
  category: string;
  projectId: string;
  project_image: string;
  project_video: string;
  tech_image: string;
  tags: string[];
  color: string;
  mousePosition: MousePosition;
  isInView: boolean;
  modalRef: RefObject<HTMLDivElement | null>;
  manageModal?: (isActive: boolean, index: number, x: number, y: number) => void;
}

export default function PortfolioItem({
  title,
  project_image,
  tech_image,
  tags,
  mousePosition,
}: Props) {
  const { x, y } = mousePosition;
  const [isActive, setIsActive] = useState(false);

  // Only enable the cursor-following preview on devices with a real pointer
  // (a mouse) — never on iOS / touch screens, which have no hover.
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const showPreview = canHover && isActive && !!project_image;

  return (
    <li
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      className={cn("group", "w-full", "border-b", "py-8", "sm:py-10")}
    >
      <Link
        href={`/portfolio/${slugify(title)}`}
        aria-label={`View ${title} project`}
        className={cn("relative", "block")}
      >
        <div
          className={cn(
            "md:flex",
            "items-center",
            "justify-between",
            "gap-6",
            "py-10",
            "px-16",
            "md:px-24",
          )}
        >
          <h2
            className={cn(
              "min-w-0",
              "max-w-full",
              "truncate",
              "text-[6vw]",
              "m-0",
              "transition-all",
              "duration-[800]",
              "group-hover:-translate-x-2.5",
              "font-pp-acma",
              "text-slate-700",
            )}
          >
            {title}
          </h2>

          <div
            className={cn(
              "shrink-0",
              "transition-all",
              "duration-[400]",
              "group-hover:translate-x-2.5",
              "relative",
              "h-[100px]",
              "w-[20vw]",
            )}
          >
            <Image
              className="object-contain size-full"
              fill
              src={tech_image}
              alt="tech stack logo"
              sizes="20vw"
            />
          </div>
        </div>

        <Tags
          data={tags}
          className={cn("absolute bottom-2 left-16 flex-nowrap max-w-none")}
        />
      </Link>

      {/* Cursor-following poster preview — desktop/mouse only (guarded by
          canHover), so it never appears on iOS/touch. The outer layer follows
          the cursor (x/y springs from the parent), the middle centers on it, and
          the inner fades/scales in without fighting those transforms. */}
      {showPreview && (
        <motion.div
          aria-hidden
          style={{ x, y }}
          className="pointer-events-none fixed left-0 top-0 z-50"
        >
          <div className="-translate-x-1/2 -translate-y-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative aspect-video w-72 overflow-hidden rounded-xl shadow-2xl"
            >
              <Image
                src={resolveImageSrc(project_image, "/images")}
                alt=""
                fill
                sizes="288px"
                className="object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-black/50 py-2 font-pp-acma text-xs font-medium text-white backdrop-blur-sm">
                View project
                <RiArrowRightUpLine className="size-3.5" />
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </li>
  );
}
