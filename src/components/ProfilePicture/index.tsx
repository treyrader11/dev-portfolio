"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useAnimationControls, motion } from "framer-motion";
import { useEffect } from "react";

interface Props {
  src: string;
  className?: string;
  isBordered?: boolean;
  isBlob?: boolean;
  isMagnetic?: boolean;
}

export default function ProfilePicture({
  src,
  className,
  isBordered = false,
  isBlob = false,
}: Props) {
  const containerProps = {
    className: cn(
      "rounded-full",
      "overflow-hidden",
      "relative",
      "flex",
      { "border border-secondary": isBordered },
      className
    ),
  };

  const imageProps = {
    fill: true as const,
    priority: true as const,
    src,
    className: "object-cover",
    sizes: "100vw",
  };

  const content = isBlob ? (
    <Image
      width={40}
      height={40}
      src={src}
      className={cn(
        "blob",
        "object-cover",
        className
      )}
      alt="profile picture of Trey"
    />
  ) : (
    <div {...containerProps}>
      <Image alt="profile picture of Trey" {...imageProps} />
    </div>
  );

  return content;
}
