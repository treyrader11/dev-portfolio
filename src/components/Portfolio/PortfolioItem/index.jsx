"use client";

import BlurredIn from "@/components/BlurredIn";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import mern from "/public/images/tech/mern.png";

export default function PortfolioItem({
  index,
  title,
  category,
  manageModal,
  projectId,
  tech_image,
}) {
  // const isMern = category.toLowerCase() === "mern";
  // const isReactNative = category.includes("native");
  // const isNext = category.includes("next");

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
        "py-12",
        "px-16",
        "md:px-24",
        "border",
        "border-t-neutral-400",
        "transition-all",
        "duration-200",
        "group",
        "hover:opacity-50",
        "hover:blur-sm"
      )}
    >
      <BlurredIn once className={cn("md:flex justify-between items-center")}>
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
        <div
          className={cn(
            "transition-all",
            "duration-[400]",
            // "font-light",
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
      </BlurredIn>
    </Link>
  );
}
