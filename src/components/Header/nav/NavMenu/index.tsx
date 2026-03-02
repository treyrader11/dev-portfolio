"use client";

import Magnetic from "@/components/Magnetic";
import { routes } from "../routes";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LinkDecorator from "@/components/LinkDecorator";
import { userData } from "@/lib/data";

const { resumeUrl } = userData;

interface Props {
  handleNavMenu: () => void;
  className?: string;
  backgroundHasColor: boolean;
}

export default function NavMenu({
  handleNavMenu,
  className,
  backgroundHasColor,
}: Props) {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);

  return (
    <nav
      className={cn(
        "flex",
        "font-mono",
        "items-center",
        "sm:mt-4",
        backgroundHasColor ? "text-white" : "text-gray-500",
        className
      )}
    >
      <div className="hidden sm:flex md">
        {routes.map(({ label, href }) => {
          if (label !== "Home") {
            return (
              <div
                key={href}
                onMouseEnter={() => setSelectedIndicator(href)}
                onMouseLeave={() => setSelectedIndicator(pathname)}
                className={cn(
                  "group",
                  "flex",
                  "flex-col",
                  "relative",
                  "z-[1]",
                  "p-[15px]"
                )}
              >
                <Magnetic>
                  <Link href={href} scroll={false}>
                    {label}
                    <LinkDecorator isActive={selectedIndicator == href} />
                  </Link>
                </Magnetic>
              </div>
            );
          } else {
            return null;
          }
        })}
        <div
          className={cn(
            "group",
            "flex-col",
            "relative",
            "z-[1]",
            "p-[15px]",
            "hidden",
            "sm:flex"
          )}
        >
          <Magnetic>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
              Resume
              <LinkDecorator isActive={selectedIndicator == "resume"} />
            </a>
          </Magnetic>
        </div>
      </div>
      <Magnetic>
        <div
          onClick={handleNavMenu}
          className={cn(
            "group",
            "flex",
            "relative",
            "z-[1]",
            "p-[15px]",
            "sm:hidden",
            "space-x-3",
            "items-center",
            "cursor-pointer"
          )}
        >
          <LinkDecorator
            className={cn("m-0", "scale-100", "animate-pulse", {
              "bg-gray-500": !backgroundHasColor,
            })}
          />
          <p>Menu</p>
        </div>
      </Magnetic>
    </nav>
  );
}
