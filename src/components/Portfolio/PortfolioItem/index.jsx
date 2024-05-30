"use client";

import BlurredIn from "@/components/BlurredIn";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import Tags from "./Tags";
import Video from "@/components/Video";

export default function PortfolioItem({
  index,
  title,
  category,
  manageModal,
  projectId,
  tech_image,
  tags,
}) {
  return (
    <Link
      href={`/project/${projectId}`}
      onMouseEnter={(e) => {
        manageModal(true, index, e.clientX, e.clientY);
      }}
      onMouseLeave={(e) => {
        manageModal(false, index, e.clientX, e.clientY);
      }}
      className={cn(
        "w-full",
        // "relative",
        "border",
        "border-t-neutral-400",
        "transition-all",
        "duration-200",
        "group",
        "hover:opacity-50",
        // "hover:blur-sm"
      )}
    >
      <BlurredIn once className={cn("relative")}>
        <div
          className={cn(
            "md:flex justify-between items-center",
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
              "duration-[400]",
              "group-hover:-translate-x-2.5"
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
      </BlurredIn>
    </Link>
  );
}
