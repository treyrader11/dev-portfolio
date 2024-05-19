"use client";

import Magnetic from "@/common/Magnetic";
import { routes } from "../routes";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function NavMenu({ handleNavMenu, className }) {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);

  return (
    <nav className={cn("flex items-center", className)}>
      <div className="hidden sm:flex">
        {routes.map(({ label, href }) => {
          if (label !== "Home") {
            return (
              <div
                key={href}
                onMouseEnter={() => {
                  setSelectedIndicator(href);
                }}
                onMouseLeave={() => {
                  setSelectedIndicator(pathname);
                }}
                className={cn(
                  "group",
                  "flex",
                  "flex-col",
                  "relative",
                  "z-[1]",
                  "p-[15px]"
                )}
              >
                <Magnetic key={href}>
                  <Link href={href}>
                    {label}
                    <Indicator
                      className={pathname === "/info" && "bg-black"}
                      isActive={selectedIndicator == href}
                    />
                  </Link>
                </Magnetic>
              </div>
            );
          } else {
            return;
          }
        })}
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
          <Indicator className="m-0 scale-100" />
          <p>Menu</p>
        </div>
      </Magnetic>
    </nav>
  );
}

function Indicator({ className, isActive }) {
  return (
    <div
      className={cn(
        "size-[5px]",
        "transition-transform",
        "duration-200",
        "custom-ease-in-out",
        "transform",
        "-translate-x-1/2",
        "rounded-full",
        "bg-white",
        "mx-auto",
        "mt-3",
        "scale-0",
        "group-hover:scale-100",
        isActive && cn("scale-100"),
        className
      )}
    />
  );
}
