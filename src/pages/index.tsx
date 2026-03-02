"use client";

import { useRef, useEffect } from "react";
import type { NextPage } from "next";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import Inner from "@/components/layout/Inner";
import { cn } from "@/lib/utils";
import Description from "@/components/Description";
import SlidingImages from "@/components/SlidingImages";
import RecentProjects from "@/components/RecentProjects";
import Hero from "@/components/Hero";
import PositionProvider from "@/components/providers/PositionProvider";
// import References from "@/components/References";

const inter = Inter({ subsets: ["latin"] });

interface LocomotiveScrollInstance {
  destroy(): void;
  scrollTo(target: number | string | HTMLElement, options?: Record<string, unknown>): void;
}

const Home: NextPage = () => {
  const container = useRef<HTMLDivElement>(null);
  const locomotiveScrollRef = useRef<LocomotiveScrollInstance | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      locomotiveScrollRef.current = new LocomotiveScroll() as LocomotiveScrollInstance;
    })();

    return () => {
      // Cleanup on unmount
      if (locomotiveScrollRef.current) {
        locomotiveScrollRef.current.destroy();
      }
    };
  }, []);

  return (
    <main className={cn(inter.className, "overflow-clip")}>
      <Inner ref={container} backgroundColor="#934E00">
        <Hero className={cn("min-h-screen bg-dark")} />
        <Description className={cn("bg-white")} />
        <PositionProvider>
          <RecentProjects className={cn("bg-white")} />
        </PositionProvider>

        <div className={cn("min-h-screen relative px-20")}>
          {/* <References /> */}
          <SlidingImages className="bg-white" />
        </div>
      </Inner>
    </main>
  );
};

export default Home;
