"use client";

import Link from "next/link";
import { GoChevronRight } from "react-icons/go";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  items: Crumb[];
  className?: string;
}

// Reusable breadcrumb trail. Each crumb with an href links to that page; the
// last crumb is rendered as the current page (not a link).
export default function Breadcrumbs({ items, className }: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-sm text-light-400",
        className,
      )}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && (
              <GoChevronRight className="size-3.5 shrink-0 text-light-400/60" />
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast && "font-medium text-white")}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
