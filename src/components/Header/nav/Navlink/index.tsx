"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { slide } from "../../motion";
import { cn } from "@/lib/utils";
import LinkDecorator from "@/components/LinkDecorator";
import type { Route } from "@/types";

interface Props {
  data: Route;
  // Stagger position, fed to the `slide` variant so each link (and the title)
  // slides in/out one after another — like the awwwards original.
  index: number;
  isActive: boolean;
  setSelectedIndicator: (href: string) => void;
  onClose: () => void;
  className?: string;
}

export default function Navlink({
  data,
  index,
  isActive,
  setSelectedIndicator,
  onClose,
  className,
}: Props) {
  const { label, href } = data;

  return (
    <motion.div
      custom={index}
      variants={slide}
      initial="initial"
      animate="enter"
      exit="exit"
      onMouseEnter={() => setSelectedIndicator(href)}
      className="relative"
    >
      <Link
        href={href}
        scroll={false}
        className={cn("relative flex items-center", className)}
        onClick={onClose}
      >
        <LinkDecorator
          isActive={isActive}
          className={cn("size-2.5 bg-white absolute -left-[30px]")}
        />
        {label}
      </Link>
    </motion.div>
  );
}
