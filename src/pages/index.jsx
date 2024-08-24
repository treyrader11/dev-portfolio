"use client";

import { useRef, useEffect } from "react";
import { Inter } from "next/font/google";
import Inner from "@/components/layout/Inner";
import { cn } from "@/lib/utils";
import Description from "@/components/Description";
import SlidingImages from "@/components/SlidingImages";
import RecentProjects from "@/components/RecentProjects";
import Hero from "@/components/Hero";
import { useScroll } from "framer-motion";
import PositionProvider from "@/components/providers/PositionProvider";
import References from "@/components/References";
import BlockGrid from "@/components/BlockGrid";
import ReferencesGSAP from "@/components/ReferencesGSAP";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const container = useRef();

  //pass in for section transitions
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const locomotiveScroll = new LocomotiveScroll();
    })();
  }, []);

  return (
    <main className={cn(inter.className, "overflow-clip")}>
      <Inner ref={container} backgroundColor="#934E00">
        {/* <BlockGrid className="fixed inset-0"  /> */}
        <Hero
          // scrollYProgress={scrollYProgress}

          className={cn("min-h-screen bg-dark")}
        />

        <Description
          // scrollYProgress={scrollYProgress}
          className={cn(
            // "sticky",
            // "top-0",
            // "min-h-[170vh]",
            // "pt-[20vh]",
            "bg-white"
          )}
        />
        <PositionProvider>
          <RecentProjects className={cn("sticky top-0 bg-white")} />
        </PositionProvider>

        <div className={cn("min-h-screen relative px-20")}>
          <References />
          <div
            className={
              cn()
              // "sticky",
              // "top-0"
            }
          >
            {/* <ReferencesGSAP /> */}
          </div>
          {/* <SlidingImages className="bg-white" /> */}
        </div>
      </Inner>
    </main>
  );
}
