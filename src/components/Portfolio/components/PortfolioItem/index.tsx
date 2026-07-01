"use client";

import { cn, slugify } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { RiArrowRightUpLine } from "react-icons/ri";
import Tags from "./Tags";
import Video from "@/components/Video";
import Modal from "../Modal";
import MouseoverModal from "@/components/MouseoverModal";
// import { useScroll, motion, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, type RefObject } from "react";
import { useIsMobile } from "@/hooks/useWindowDimensions";
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
  index,
  title,
  category,
  projectId,
  project_image,
  project_video,
  tech_image,
  tags,
  color,
  mousePosition,
  isInView,
  modalRef,
}: Props) {
  const [isModalActive, setIsModalActive] = useState(false);

  const { x, y } = mousePosition;

  const router = useRouter();
  const isMobile = useIsMobile();

  console.log("isInView", isInView);
  return (
    // <Link
    //   style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%, 100% 0)" }}
    //   href={`/project/${projectId}`}
    //   onMouseEnter={() => setIsModalActive(true)}
    //   onMouseLeave={() => setIsModalActive(false)}
    //   className={cn(
    //     "w-full",
    //     "border",
    //     "border-t-neutral-400",
    //     "transition-all",
    //     "duration-500",
    //     "group"
    //     // "hover:opacity-50"
    //   )}
    // >
    <li
      style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%, 100% 0)" }} // clips modal
      onMouseEnter={() => setIsModalActive(true)}
      onMouseLeave={() => setIsModalActive(false)}
      className={cn(
        "w-full",
        "border-b",
        "py-2",
        // "divide-neutral-400",
        // "divide-y",
        // "transition-all",
        // "duration-500",
        "group"
        // "hover:opacity-50"
      )}
    >
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
            "md:px-24"
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
              "text-slate-700"
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
              "w-[20vw]"
            )}
          >
            {/* {category} */}
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

        {/* Hover affordance: a "View project" pill that fades in and rises,
            hinting the row links to the project's details page. */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none",
            "absolute",
            "left-1/2",
            "top-1/2",
            "z-10",
            "-translate-x-1/2",
            "-translate-y-1/2"
          )}
        >
          <span
            className={cn(
              "flex",
              "items-center",
              "gap-2",
              "rounded-full",
              "border",
              "border-slate-700/25",
              "bg-white/70",
              "px-5",
              "py-2.5",
              "font-pp-acma",
              "text-sm",
              "font-medium",
              "text-slate-700",
              "shadow-lg",
              "backdrop-blur-sm",
              "translate-y-8",
              "opacity-0",
              "transition-all",
              "duration-500",
              "ease-out",
              "group-hover:translate-y-0",
              "group-hover:opacity-100"
            )}
          >
            View project
            <RiArrowRightUpLine className="size-4" />
          </span>
        </span>
      </Link>

      {/*
        ──────────────────────────────────────────────────────────────────────
        TEMPORARILY DISABLED — hover cursor-follow video modal. NEEDS FINE-TUNING.
        ──────────────────────────────────────────────────────────────────────
        What this is:
          On hover over a project row, `isModalActive` flips true (via the <li>
          onMouseEnter/onMouseLeave above) and this <Modal> (the GSAP cursor-
          follower in ../Modal) renders a floating panel that tracks the cursor
          (x/y come from the parent Portfolio's mousePosition springs) and plays
          the project's looping video. The wrapping <Link> is also what made the
          row navigate to /project/[projectId].

        Why it's commented out (do NOT delete — restore after tuning):
          - Positioning is off: the hard-coded mobile offsets ({ x: 180, y: 655 })
            and the clip-path on the <li> need rework so the panel sits correctly
            across breakpoints and doesn't get clipped.
          - The follow/spring feel and active-state timing need polish.
          - `imageUrl`/`isInView` wiring here is half-finished (see commented
            className that was meant to scale/hide based on in-view state).

        Side effect of disabling: project rows are no longer clickable, since the
        only navigation was attached to this <Link>. Re-add a row-level link (or
        re-enable this block) when restoring. To bring it back, just uncomment.

        <Link href={`/project/${projectId}`} scroll={false}>
          <Modal
            ref={modalRef}
            style={isMobile ? { x: 180, y: 655 } : { x, y }}
            isActive={isModalActive}
            imageUrl={project_image}
            // className={cn(isInView ? "scale-100 flex" : "hidden scale-0")}
          >
            <div
              className={cn("size-full flex items-center justify-center")}
              style={{ backgroundColor: color }}
            >
              <span className="text-white">{title}</span>
              <Video src={`/videos/${project_video}`} muted loop autoPlay />
            </div>
          </Modal>
        </Link>
      */}
    </li>
  );
}
