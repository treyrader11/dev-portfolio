"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

export default function PortfolioItem({
  index,
  title,
  category,
  manageModal,
  projectId,
}) {
  console.log('projectId', projectId)
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
        "flex",
        "w-full",
        "justify-between",
        "items-center",
        "py-12",
        "px-16",
        "md:px-24",
        "border",
        "border-t-neutral-400",
        "transition-all",
        "duration-200",
        "group",
        "hover:opacity-50"
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
      <p
        className={cn(
          "transition-all",
          "duration-[400]",
          "font-light",
          "group-hover:translate-x-2.5"
        )}
      >
        {category}
      </p>
    </Link>
  );
}
