"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, motion, useTransform, useSpring } from "framer-motion";
import { cn, getLocalTime } from "@/lib/utils";
import Brand from "@/components/Brand";
import Socials from "./components/Socials";
import Contact from "./components/Contact";
import NoiseBg from "@/components/NoiseBg";

const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

export default function Footer() {
  const container = useRef<HTMLDivElement>(null);

  // The local time is client-only: rendering it during SSR then hydrating a
  // moment later produces a mismatch. Start empty (matches the server), then
  // fill in and refresh on the client.
  const [localTime, setLocalTime] = useState("");
  useEffect(() => {
    const update = () => setLocalTime(getLocalTime());
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end end"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [-500, 0]);
  const rawX = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const rawRotate = useTransform(scrollYProgress, [0, 1], [120, 90]);

  // Spring-smoothed values for buttery animation
  const y = useSpring(rawY, springConfig);
  const x = useSpring(rawX, springConfig);
  const rotate = useSpring(rawRotate, springConfig);

  return (
    <motion.div
      style={{ y, willChange: "transform" }}
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
      {/* Fuzzy grain background covering the whole footer (the upper Contact
          part and the lower footer). Sits behind everything at -z-10 so no
          content z-index needs changing, and clips itself so it never touches
          the rotated Contact element. Shown per the CMS appearance config. */}
      <NoiseBg area="footer" className="-z-10" />

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
              "gap-5"
            )}
          >
            <div className="flex gap-1">
              <span className="">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                })}
              </span>

              <Brand />
            </div>
            <div className="flex flex-col gap-3">
              <h5 className="text-[10px] uppercase text-light-100">
                local time
              </h5>
              {/* Reserve height while it's empty pre-mount to avoid a layout shift. */}
              <span suppressHydrationWarning>{localTime || " "}</span>
            </div>
          </span>
        </div>
      </footer>
    </motion.div>
  );
}
