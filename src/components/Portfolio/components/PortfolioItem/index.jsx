"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import Tags from "./Tags";
import Video from "@/components/Video";
import Modal from "../Modal";
import MouseoverModal from "@/components/MouseoverModal";
// import { useScroll, motion, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useIsMobile } from "@/hooks/useWindowDimensions";

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
}) {
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
    <div
      style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%, 100% 0)" }}
      onMouseEnter={() => setIsModalActive(true)}
      onMouseLeave={() => setIsModalActive(false)}
      className={cn(
        "w-full",
        "border",
        "border-t-neutral-400",
        "transition-all",
        "duration-500",
        "group"
        // "hover:opacity-50"
      )}
    >
      <div className={"relative"}>
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
              sizes={{}}
            />
          </div>
        </div>
        <Tags
          data={tags}
          className={cn("absolute bottom-2 left-16 flex-nowrap max-w-none")}
        />
      </div>

      <Link href={`/project/${projectId}`}>
        <Modal
          ref={modalRef}
          style={isMobile ? { x: 180, y: 655 } : { x, y }}
          // style={isMobile ? { x: 180, y: 550 } : { x, y }}
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
    </div>
  );
}
