"use client";

import { cn, slugify } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import Tags from "./Tags";

interface Props {
  index: number;
  title: string;
  category?: string;
  projectId?: string;
  project_image?: string;
  project_video?: string;
  tech_image: string;
  tags: string[];
  color?: string;
  // Hovering the row drives the shared cursor modal (card + dot + "View"),
  // provided by the Portfolio only on pointer devices — undefined on touch.
  manageModal?: (isActive: boolean, index: number, x: number, y: number) => void;
}

export default function PortfolioItem({
  index,
  title,
  tech_image,
  tags,
  manageModal,
}: Props) {
  return (
    <li
      onMouseEnter={(e) => manageModal?.(true, index, e.clientX, e.clientY)}
      onMouseLeave={(e) => manageModal?.(false, index, e.clientX, e.clientY)}
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
              "transition-transform",
              "duration-500",
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
              "transition-transform",
              "duration-500",
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
    </li>
  );
}
