"use client";

import { cn } from "@/lib/utils";
import { Vanish } from "../Vanish";
import BlurredIn from "../BlurredIn";
import React from "react";

interface Props {
  className?: string;
  containerClass?: string;
  backgroundColor?: string;
  title: string;
  hasBlur?: boolean;
  once?: boolean;
  delay?: number;
}

export default function PageTitle({
  className,
  containerClass,
  backgroundColor,
  title,
  hasBlur = false,
  once = false,
}: Props) {
  const commonContainerClasses = cn(
    "mx-auto",
    "bg-dark-400",
    "px-6",
    "relative",
    containerClass
  );
  const commonVanishClasses = cn(
    "text-7xl",
    "font-bold",
    "text-left",
    "text-secondary",
    "relative",
    className
  );

  const content = (
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
      {content}
    </BlurredIn>
  ) : (
    <div style={{ backgroundColor }} className={commonContainerClasses}>
      {content}
    </div>
  );
}
