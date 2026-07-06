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
  category,
  image,
  tags,
  manageModal,
}: Props) {
  const logo = image?.icon ? resolveImageSrc(image.icon, "/images") : null;
  const hasTags = tags.filter(Boolean).length > 0;

  return (
    // Editorial list row: hover still drives the shared cursor modal. Padding is
    // inset so the divider below never reaches the screen edges.
    <li
      onMouseEnter={(e) => manageModal?.(true, index, e.clientX, e.clientY)}
      onMouseLeave={(e) => manageModal?.(false, index, e.clientX, e.clientY)}
      className={cn(
        "group",
        "relative",
        "w-full",
        "px-8",
        "md:px-16",
        "lg:px-24",
      )}
    >
      {/* Project logo — a tiny circle in the top-left corner, at the inset edge.
          pointer-events-none so the whole row stays clickable via the Link. */}
      {logo && (
        <div
          className={cn(
            "pointer-events-none",
            "absolute",
            "z-[1]",
            "top-8",
            "md:top-12",
            "left-8",
            "md:left-16",
            "lg:left-24",
            "size-8",
            "overflow-hidden",
            "rounded-full",
            "border",
            "border-gray-200",
            "bg-white",
          )}
        >
          <Image
            src={logo}
            alt={title}
            width={32}
            height={32}
            className="size-full object-contain"
          />
        </div>
      )}

      <Link
        href={`/portfolio/${slugify(title)}`}
        aria-label={`View ${title} project`}
        // NOTE: not the `block` utility — it collides with a global
        // `.block { width:50px }` decoration in globals.css. flex-col gives a
        // full-width block instead.
        className={cn(
          "relative",
          "flex",
          "flex-col",
          "border-b",
          "border-gray-200",
          // Extra bottom room on mobile so the tags (pinned to the divider) sit
          // clear of the title; desktop keeps the symmetric py-12.
          "pt-8",
          "pb-16",
          "md:py-12",
        )}
      >
        {/* Title large on the left, category right-aligned on the same baseline.
            pl-12 clears the logo circle. */}
        <div className={cn("flex", "items-end", "justify-between", "gap-4", "pl-12")}>
          <h2
            className={cn(
              "m-0",
              "min-w-0",
              "truncate",
              "text-4xl",
              "md:text-6xl",
              "font-light",
              "text-dark",
            )}
          >
            {title}
          </h2>
          {category && (
            <span
              className={cn(
                "shrink-0",
                "whitespace-nowrap",
                "pb-2",
                "text-sm",
                "text-gray-400",
              )}
            >
              {category}
            </span>
          )}
        </div>

        {/* Tags flush against the bottom divider (bottom-2 = breathes above it). */}
        {hasTags && (
          <Tags
            data={tags}
            className={cn(
              "absolute",
              "bottom-2",
              "left-12",
              "gap-2",
              "flex-nowrap",
              "max-w-none",
            )}
          />
        )}
      </Link>
    </li>
  );
}
