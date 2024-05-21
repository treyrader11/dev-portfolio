"use client";

import { useRef } from "react";
import { useScroll, motion, useTransform } from "framer-motion";
import { cn, getLocalTime } from "@/lib/utils";
import StyledLink from "@/components/StyledLink";
import Brand from "@/components/Brand";
import Socials from "./components/Socials";
import Contact from "./components/Contact";

export default function Footer() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y = useTransform(scrollYProgress, [0, 1], [-500, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [120, 90]);
  return (
    <motion.div
      style={{ y }}
      ref={container}
      className={cn(
        "text-white",
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "bg-dark",
        "relative",
        "font-light"
      )}
    >
      <Contact style={{ x }} rotate={rotate} />
      <footer
        className={cn(
          "flex",
          "flex-col",
          "size-full",
          "md:flex-row",
          "md:flex-row-reverse",
          "md:items-center",
          "justify-between",
          "mt-[100px]",
          "p-6",
          "text-[15px]"
        )}
      >
        <Socials className={cn("py-5 font-mono")} />
        <div className={cn("flex gap-2.5 py-5 w-full")}>
          <span
            className={cn(
              "flex",
              "items-end",
              "w-full",
              "justify-between",
              "md:justify-normal",
              "gap-3.5"
            )}
          >
            <StyledLink onColor className="flex gap-1">
              <span className="font-mono">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                })}
              </span>

              <Brand />
            </StyledLink>
            <span className="flex flex-col gap-3">
              <h5 className="text-[10px] uppercase text-light-100">
                local time
              </h5>
              {getLocalTime()}
            </span>
          </span>
        </div>
      </footer>
    </motion.div>
  );
}
