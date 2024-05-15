"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { menuSlide } from "../anim";
import Link from "./Link";
import Curve from "./Curve";
import Footer from "./Footer";
import { routes } from "./routes";
import GithubCornerBadge from "@/components/GithubCornerBadge";
import { cn } from "@/lib/utils";

export default function Nav() {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);

  return (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className={cn(
        "h-screen",
        "bg-dark-500",
        "fixed",
        // "z-[99999]",
        "inset-x-0",
        "text-white",
        "z-[4]",
        "md:left-[calc(100vw-414px)]"
      )}
    >
      <GithubCornerBadge />
      <div
        className={cn(
          "h-full",
          "py-[100px]",
          "items-center",
          "flex",
          "flex-col",
          "justify-between"
        )}
      >
        <div
          onMouseLeave={() => {
            setSelectedIndicator(pathname);
          }}
          className={cn("flex", "flex-col", "text-6xl", "gap-5", "mt-[80px]")}
        >
          <div
            className={cn(
              "text-light-100",
              "border-b",
              "border-light-300/50",
              "uppercase",
              "text-xs",
              "mb-10",
              "w-full"
            )}
          >
            <p>Trey Rader</p>
          </div>
          {routes.map((routes, index) => {
            return (
              <Link
                key={index}
                data={{ ...routes, index }}
                isActive={selectedIndicator == routes.href}
                setSelectedIndicator={setSelectedIndicator}
                className={cn("no-underline", "text-white", "font-light")}
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
