"use client";

import { cn } from "@/lib/utils";
import { Vanish } from "../Vanish";

export default function PageTitle({
  className,
  containerClass,
  backgroundColor,
  title,
}) {
  return (
    <div
      style={{ backgroundColor }}
      className={cn("h-48 mx-auto bg-dark-400 px-6", containerClass)}
    >
      <Vanish
        className={cn(
          "py-[125px]",
          "sm:py-[130px]",
          "md:py-[110px]",
          "text-7xl",
          "font-bold",
          "md:text-left",
          "text-left",
          "md:text-9xl",
          "text-secondary",
          className
        )}
        delay={0.2}
        phrases={[title]}
      />
    </div>
  );
}
