"use client";

import { useRef, useEffect } from "react";
import { Inter } from "next/font/google";
import Inner from "@/components/layout/Inner";
import { cn } from "@/lib/utils";
import Description from "@/components/Description";
import SlidingImages from "@/components/SlidingImages";
import RecentProjects from "@/components/RecentProjects";
import Hero from "@/components/Hero";
import PositionProvider from "@/components/providers/PositionProvider";
import References from "@/components/References";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const container = useRef();

  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const locomotiveScroll = new LocomotiveScroll();
    })();
  }, []);

  return (
    <main className={cn(inter.className, "overflow-clip")}>
      <Inner ref={container} backgroundColor="#934E00">
        <Hero className={cn("min-h-screen bg-dark")} />
        <Description className={cn("bg-white")} />
        <PositionProvider>
          <RecentProjects className={cn(" bg-white")} />
        </PositionProvider>

        <div className={cn("min-h-screen relative px-20")}>
          {/* <References /> */}
          
          <SlidingImages className="bg-white" />
        </div>
      </Inner>
    </main>
  );
}
