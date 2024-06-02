"use client";

import BlurredIn from "@/components/BlurredIn";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import Tags from "./Tags";
import Video from "@/components/Video";
import { motion } from "framer-motion";

export default function PortfolioItem({
  index,
  title,
  category,
  // manageModal,
  projectId,
  project_image,
  tech_image,
  tags,
  mousePosition,
}) {
  const { x, y } = mousePosition;
  return (
    <Link
      style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%, 100% 0)" }}
      href={`/project/${projectId}`}
      // onMouseEnter={(e) => {
      //   manageModal(true, index, e.clientX, e.clientY);
      // }}
      // onMouseLeave={(e) => {
      //   manageModal(false, index, e.clientX, e.clientY);
      // }}
      className={cn(
        "w-full",
        "border",
        "border-t-neutral-400",
        "transition-all",
        "duration-500",
        "group",
        "hover:opacity-50"
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
          <div></div>
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
          {/* <Tags data={tags} className={cn("")} /> */}
        </div>
        <Tags
          data={tags}
          className={cn("absolute bottom-2 left-16 flex-nowrap max-w-none")}
        />
      </div>
      <motion.div
        className={cn(
          "h-[30vw]",
          "w-[25vw]",
          "fixed",
          "top-0",
          "rounded-[1.5vw]",
          "overflow-hidden"
        )}
        style={{ x, y }}
      >
        <Image
          className="object-cover w-full"
          src={`/images/${project_image}`}
          alt="image"
          fill
        />
      </motion.div>
    </Link>
  );
}
