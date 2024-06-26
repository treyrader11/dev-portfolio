"use client";

import LinkDecorator from "@/components/LinkDecorator";
import Magnetic from "@/components/Magnetic";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Socials({ className, links, md }) {
  return (
    <motion.section style={{ bottom: md }} className={cn(className)}>
      <h1
        className={cn(
          "font-pp-acma",
          "mb-4",
          "text-2xl",
          "font-semibold",
          "sm:text-gray-700",
          "flex",
          "items-end",
          "gap-px"
        )}
      >
        Socials
        <span className="text-2xl">.</span>
      </h1>

      <div
        className={cn(
          "font-mono",
          "text-lg",
          "sm:text-gray-500",
          "flex",
          "items-start",
          "flex-col",
          "justify-end",
          "cursor-pointer",
          "w-fit",
          "md:pb-[20vh]",
          "text-left",
          "mx-3"
        )}
      >
        {links.map(({ name, href }) => (
          <SocialLink key={name} name={name} href={href} />
        ))}
      </div>
    </motion.section>
  );
}

function SocialLink({ name, href }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Magnetic>
      <a
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        href={href}
        className={cn("py-2 text-left w-fit")}
      >
        <span
          className={cn(
            "flex",
            "flex-row-reverse",
            // "md:flex-col",
            "w-fit",
            "gap-2"
          )}
        >
          {name}
          <LinkDecorator
            isActive={isHovered}
            className={cn(
              "sm:bg-gray-500",
              "text-left",
              "size-1.5",
              "absolute",
              "-left-3"
            )}
          />
        </span>
      </a>
    </Magnetic>
  );
}
