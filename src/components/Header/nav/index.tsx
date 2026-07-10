"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { menuSlide, slide } from "../motion";
import Navlink from "./Navlink";
import Curve from "./Curve";
import Footer from "./Footer";
import { routes } from "./routes";
import GithubCornerBadge from "@/components/GithubCornerBadge";
import { cn } from "@/lib/utils";

interface NavProps {
  onClose: () => void;
}

export default function Nav({ onClose }: NavProps) {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside the menu panel (ignoring the burger toggle,
  // which manages open/close itself). The panel covers the full screen on
  // mobile, so this mainly applies to the desktop side panel.
  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        !target.closest("[data-nav-toggle]")
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [onClose]);

  return (
    <motion.div
      ref={panelRef}
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className={cn(
        "h-screen",
        "bg-dark-500",
        "fixed",
        "inset-x-0",
        "text-white",
        // Above the FAB portal (2147483644) so the open menu overlaps the admin
        // and scroll-to-top FABs; the burger (2147483646) still sits above this.
        "z-[2147483645]",
        "md:left-[calc(100vw-414px)]"
      )}
    >
      <GithubCornerBadge />
      <div
        className={cn(
          "h-full",
          // Lighter vertical padding on the narrow desktop panel so the links +
          // footer fit within the viewport (with browser chrome) instead of the
          // footer overflowing off the bottom.
          "py-[100px]",
          "md:py-14",
          "items-center",
          "flex",
          "flex-col",
          "justify-between",
          "sm:w-full",
          "md:w-auto",
          "max-w-[50vw]",
          "mx-auto"
        )}
      >
        <div
          onMouseLeave={() => {
            setSelectedIndicator(pathname);
          }}
          className={cn(
            "flex",
            "flex-col",
            // Smaller links + tighter spacing on desktop so five items + the
            // footer clear the viewport; mobile keeps the big type.
            "text-6xl",
            "md:text-5xl",
            "gap-5",
            "md:gap-3",
            "mt-[80px]",
            "md:mt-8",
            "w-full",
            "md:w-auto"
          )}
        >
          {/* Menu title slides in first, then each page link staggers after. */}
          <motion.div
            custom={0}
            variants={slide}
            initial="initial"
            animate="enter"
            exit="exit"
            className={cn(
              "text-light-100",
              "border-b",
              "border-light-300/50",
              "uppercase",
              "text-xs",
              "mb-10"
            )}
          >
            <p>Trey Rader</p>
          </motion.div>
          {routes.map((route, index) => {
            return (
              <Navlink
                key={index}
                index={index + 1}
                data={route}
                isActive={selectedIndicator == route.href}
                setSelectedIndicator={setSelectedIndicator}
                onClose={onClose}
                className={cn("text-white", "font-light")}
              />
            );
          })}
        </div>
        <Footer />
      </div>
      <Curve />
    </motion.div>
  );
}
