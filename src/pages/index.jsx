"use client";

import { useState, useRef, useEffect } from "react";
import { Inter } from "next/font/google";
import Inner from "@/components/layout/Inner";
import { cn } from "@/lib/utils";
import Description from "@/components/Description";
import SlidingImages from "@/components/SlidingImages";
import RecentProjects from "@/components/RecentProjects";
import Hero from "@/components/Hero";
import { useScroll, AnimatePresence } from "framer-motion";
import PositionProvider from "@/components/providers/PositionProvider";
import References from "@/components/References";
import BlockGrid from "@/components/BlockGrid";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const container = useRef();

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const locomotiveScroll = new LocomotiveScroll();

      // setTimeout(() => {
      //   setIsLoading(false);
      //   document.body.style.cursor = "default";
      //   window.scrollTo(0, 0);
      // }, 1200);
    })();
  }, []);

  return (
    <main className={cn(inter.className, "overflow-clip")}>
      <Inner ref={container} backgroundColor="#934E00">
        {/* <BlockGrid>
          <Hero
            isLoading={isLoading}
            scrollYProgress={scrollYProgress}
            className="sticky z-[99] top-0 min-h-screen"
          />
        </BlockGrid> */}
        {/* <BlockGrid className="fixed inset-0"  /> */}
        <Hero
          isLoading={isLoading}
          scrollYProgress={scrollYProgress}
          className="sticky top-0 min-h-screen bg-dark"
        />

        <Description
          scrollYProgress={scrollYProgress}
          className={cn(
            "sticky",
            "top-0",
            "min-h-[170vh]",
            "pt-[20vh]",
            "bg-white"
          )}
        />
        <PositionProvider>
          <RecentProjects
            className={cn(
              "sticky",
              "top-0",
              "bg-white"
              // "-mt-[50%]",
              // "md:pb-[200vh]",
              // "max-w-[1200px]" // this is where the padding breaks
            )}
          />
        </PositionProvider>

        <div className={cn("relative z-[3] min-h-screen")}>
          <References />
          <SlidingImages className="bg-white" />
        </div>
      </Inner>
    </main>
  );
}
