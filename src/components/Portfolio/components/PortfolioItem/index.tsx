"use client";

import { cn, slugify, resolveImageSrc } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { RiArrowRightUpLine } from "react-icons/ri";
import Tags from "./Tags";
import { type RefObject } from "react";
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
}: Props) {
  return (
    <li className={cn("group", "w-full", "border-b", "py-2")}>
      <Link
        href={`/portfolio/${slugify(title)}`}
        aria-label={`View ${title} project`}
        className={cn("relative", "block")}
      >
        <div
          className={cn(
            "md:flex",
            "justify-between",
            "items-center",
            "py-12",
            "px-16",
            "md:px-24",
          )}
        >
          <h2
            className={cn(
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

        {/* Hover preview — the project's poster reveals over the row (fades and
            scales in). A clean inline replacement for the old cursor-follow
            video modal. Desktop/hover only, so it never shows on touch. */}
        {project_image && (
          <span
            aria-hidden
            className={cn(
              "pointer-events-none",
              "absolute",
              "left-1/2",
              "top-1/2",
              "z-10",
              "hidden",
              "md:block",
              "aspect-video",
              "w-[36vw]",
              "max-w-md",
              "-translate-x-1/2",
              "-translate-y-1/2",
              "scale-90",
              "overflow-hidden",
              "rounded-xl",
              "opacity-0",
              "shadow-2xl",
              "transition-all",
              "duration-500",
              "ease-out",
              "group-hover:scale-100",
              "group-hover:opacity-100",
            )}
          >
            <Image
              src={resolveImageSrc(project_image, "/images")}
              alt=""
              fill
              sizes="(max-width: 768px) 36vw, 448px"
              className="object-cover"
            />
          </span>
        )}

        {/* "View project" pill — sits above the preview on hover. */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none",
            "absolute",
            "left-1/2",
            "top-1/2",
            "z-20",
            "-translate-x-1/2",
            "-translate-y-1/2",
          )}
        >
          <span
            className={cn(
              "flex",
              "items-center",
              "gap-2",
              "rounded-full",
              "border",
              "border-white/30",
              "bg-black/40",
              "px-5",
              "py-2.5",
              "font-pp-acma",
              "text-sm",
              "font-medium",
              "text-white",
              "shadow-lg",
              "backdrop-blur-sm",
              "translate-y-8",
              "opacity-0",
              "transition-all",
              "duration-500",
              "ease-out",
              "group-hover:translate-y-0",
              "group-hover:opacity-100",
            )}
          >
            View project
            <RiArrowRightUpLine className="size-4" />
          </span>
        </span>
      </Link>
    </li>
  );
}
