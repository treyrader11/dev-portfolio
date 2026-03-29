"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { scale, slide } from "../../motion";
import { cn } from "@/lib/utils";
import LinkDecorator from "@/components/LinkDecorator";
import type { Route } from "@/types";

interface Props {
  data: Route;
  isActive: boolean;
  setSelectedIndicator: (href: string) => void;
  onClose: () => void;
  className?: string;
}

export default function Navlink({
  data,
  isActive,
  setSelectedIndicator,
  onClose,
  className,
}: Props) {
  const { label, href } = data;

  return (
    <Link
      href={href}
      scroll={false}
      className={cn("relative flex items-center", className)}
      onClick={onClose}
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
