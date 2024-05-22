"use client";

import { cn } from "@/lib/utils";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const imageProps = {
  width: 100,
  height: 100,
  className: "object-cover size-full rounded-xl",
};

export default function PortfolioItem({
  title,
  icon1,
  icon2,
  project_image,
  youtube_link,
  frontend_download_link,
  backend_download_link,
  itemRef,
  category,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "w-full",
        "h-[320px]",
        "rounded-xl",
        "relative",
        // "overflow-hidden",
        "border",
        "border-secondary",
        "group"
        // "bg-indigo-400"
      )}
    >
      <Image
        src={`/images/${project_image}`}
        {...imageProps}
        alt="project image"
      />

      <div
        className={cn(
          "absolute",
          "top-1/2",
          "left-1/2",
          "group-hover:-translate-x-1/2",
          "group-hover:-translate-y-1/2",
          "bg-indigo-400",
          "size-[calc(100%_-_2rem)]",
          "transition-all",
          "duration-[400]",
          "ease-in-out",
          "opacity-0",
          "group-hover:opacity-50",
          "overflow-hidden"
          // "z-[99]"
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
          <h5 className="text-[clamp(1.5rem,2vw,2rem)] mt-8">{title}</h5>
          <div
            className={cn(
              "absolute",
              "flex",
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
          >
            <Link
              className={cn(
                "size-[3.5rem]",
                "rounded-full",
                "flex",
                "items-center",
                "justify-center",
                "transition-all",
                "ease-in-out",
                "duration-[400]",
                "bg-dark-600",
                "hover:bg-slate-400"
              )}
              href={frontend_download_link}
              target="_blank"
              rel="noreferrer"
            >
              {icon1}
            </Link>
            <Link
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
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
