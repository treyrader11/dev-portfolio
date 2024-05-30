"use client";

import LinkDecorator from "@/components/LinkDecorator";
import Magnetic from "@/components/Magnetic";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Socials({ className, links }) {
  return (
    <section className={className}>
      <h1
        className={cn(
          "mt-8",
          "mb-4",
          "text-xl",
          "font-semibold",
          "text-gray-700"
        )}
      >
        Socials
      </h1>

      <div
        className={cn(
          "font-mono",
          "text-lg",
          "text-gray-500",
          "flex",
          "items-start",
          "flex-col",
          "md:flex-row",
          "justify-end",
          "cursor-pointer",
          "w-fit",
          "md:pb-[20vh]",
          "text-left"
        )}
      >
        {links.map((link) => (
          <SocialLink key={link.name} name={link.name} href={link.href} />
        ))}
      </div>
    </section>
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
        className={cn("py-4 text-left")}
      >
        <span className={cn("flex flex-row-reverse md:flex-col gap-2")}>
          {name}
          <LinkDecorator
            isActive={isHovered}
            className="bg-gray-500 text-left size-1.5"
          />
        </span>
      </a>
    </Magnetic>
  );
}
