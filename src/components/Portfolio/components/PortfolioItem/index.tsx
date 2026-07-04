"use client";

import { cn, slugify, resolveImageSrc } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import Tags from "./Tags";
import type { ProjectImage } from "@/types/data";

interface Props {
  index: number;
  title: string;
  category?: string;
  projectId?: string;
  project_image?: string;
  project_video?: string;
  tech_image?: string;
  image?: ProjectImage;
  tags: string[];
  color?: string;
  // Hovering the row drives the shared cursor modal (card + dot + "View"),
  // provided by the Portfolio only on pointer devices — undefined on touch.
  manageModal?: (isActive: boolean, index: number, x: number, y: number) => void;
}

export default function PortfolioItem({
  index,
  title,
  image,
  tags,
  manageModal,
}: Props) {
  const logo = image?.icon ? resolveImageSrc(image.icon, "/images") : null;

  return (
    <li
      onMouseEnter={(e) => manageModal?.(true, index, e.clientX, e.clientY)}
      onMouseLeave={(e) => manageModal?.(false, index, e.clientX, e.clientY)}
      className={cn("group", "w-full", "border-b", "py-8", "sm:py-10")}
    >
      <Link
        href={`/portfolio/${slugify(title)}`}
        aria-label={`View ${title} project`}
        // NOTE: not the `block` utility — it collides with a global
        // `.block { width:50px }` decoration class in globals.css, which
        // collapsed the whole row. flex-col gives a full-width block instead.
        className={cn("relative", "flex", "flex-col")}
      >
        <div
          className={cn(
            "flex",
            "items-center",
            "gap-4",
            "sm:gap-6",
            "py-10",
            "px-16",
            "md:px-24",
          )}
        >
          {/* Project logo (from the CMS "Logo" field) shown next to the title. */}
          {logo && (
            <div
              className={cn(
                "relative",
                "shrink-0",
                "size-12",
                "sm:size-16",
                "md:size-20",
                "transition-transform",
                "duration-500",
                "group-hover:-translate-x-2.5",
              )}
            >
              <Image
                src={logo}
                alt=""
                fill
                sizes="80px"
                className="object-contain"
              />
            </div>
          )}

          <h2
            className={cn(
              // flex-1 + min-w-0 so the title takes the space beside the logo
              // and truncates instead of collapsing to zero width.
              "flex-1",
              "min-w-0",
              "truncate",
              "text-[6vw]",
              "m-0",
              "transition-transform",
              "duration-500",
              "group-hover:translate-x-2.5",
              "font-pp-acma",
              "text-slate-700",
            )}
          >
            {title}
          </h2>
        </div>

        <Tags
          data={tags}
          className={cn("absolute bottom-2 left-16 flex-nowrap max-w-none")}
        />
      </Link>
    </li>
  );
}
