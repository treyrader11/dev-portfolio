"use client";

import { cn } from "@/lib/utils";
import { Vanish } from "../Vanish";
import BlurredIn from "../BlurredIn";
import React from "react";

function PageTitle({
  className,
  containerClass,
  backgroundColor,
  title,
  hasBlur = false,
  once = false,
}) {
  const commonContainerClasses = cn(
    "h-48",
    "mx-auto",
    "bg-dark-400",
    "px-6",
    containerClass
  );
  const commonVanishClasses = cn(
    "py-[125px]",
    "sm:py-[130px]",
    "md:py-[110px]",
    "text-7xl",
    "font-bold",
    "md:text-left",
    "text-left",
    "md:text-9xl",
    "text-secondary",
    "relative",
    className
  );

  const Content = () => (
    <Vanish
      once={once}
      className={commonVanishClasses}
      delay={0.2}
      phrases={[title]}
    />
  );

  return hasBlur ? (
    <BlurredIn
      once
      style={{ backgroundColor }}
      className={commonContainerClasses}
    >
      <Content />
    </BlurredIn>
  ) : (
    <div style={{ backgroundColor }} className={commonContainerClasses}>
      <Content />
    </div>
  );
}

export default React.memo(PageTitle);
