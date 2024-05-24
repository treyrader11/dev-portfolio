"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { scale, slide } from "../../anim";
import { cn } from "@/lib/utils";
import LinkDecorator from "@/components/LinkDecorator";

export default function Navlink({
  data,
  isActive,
  setSelectedIndicator,
  className,
}) {
  const { label, href } = data;

  return (
    <Link
      href={href}
      className={cn("relative flex items-center", className)}
      onMouseEnter={() => {
        setSelectedIndicator(href);
      }}
    >
      <LinkDecorator
        isActive={isActive}
        className={cn("size-2.5 bg-white absolute -left-[30px]")}
      />
      {label}
    </Link>
  );
}
