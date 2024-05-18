import { cn } from "@/lib/utils";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const imageProps = {
  width: 100,
  height: 100,
  alt: "project image",
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
  return (
    <div
      className={cn(
        "w-full",
        "h-[320px]",
        "rounded-xl",
        "relative",
        "overflow-hidden",
        "border",
        "border-secondary"
      )}
    >
      <Image
        src={`/images/${project_image}`}
        {...imageProps}
        className="object-cover size-full rounded-xl"
      />
      <div
        className={cn(
          "absolute",
          "top-1/2",
          "left-1/2",
          "-translate-x-1/2",
          "-translate-y-1/2",
          "bg-indigo-400",
          "w-0",
          "h-[calc(100%-2rem)]",
          "transition-all",
          "duration-[400]",
          "ease-in-out",
          "opacity-0",
          "overflow-hidden"
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
              "-translate-x-1/2",
              "translate-y-[220px]",
              "scale-0",
              "transition-all",
              "duration-[400]",
              "ease-in-out",
              "opacity-0"
            )}
          >
            <Link
              className={cn(
                "size-[3.5rem]",
                "rounded-[50%]",
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
                "rounded-[50%]",
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
