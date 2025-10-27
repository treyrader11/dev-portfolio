"use client";

import { useRef, useEffect } from "react";
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

export default function Home() {
  const container = useRef();
  const locomotiveScrollRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      locomotiveScrollRef.current = new LocomotiveScroll();
    })();

    return () => {
      // Cleanup on unmount
      if (locomotiveScrollRef.current) {
        locomotiveScrollRef.current.destroy();
      }
    };
  }, []);

  // Reset scroll position after page transition
  // useEffect(() => {
  //   // Wait for the animation to complete before restoring scroll
  //   setTimeout(() => {
  //     // Restore scroll ability and reset position
  //     document.body.style.removeProperty("overflow");
  //     document.body.style.removeProperty("position");
  //     document.body.style.removeProperty("top");
  //     document.body.style.removeProperty("width");

  //     // Scroll to top after restoring scroll
  //     window.scrollTo(0, 0);
  //     if (locomotiveScrollRef.current) {
  //       locomotiveScrollRef.current.scrollTo(0, {
  //         duration: 0,
  //         disableLerp: true,
  //       });
  //     }
  //   }, 2000); // Increased timeout to match animation duration (adjust as needed)
  // }, [pathname]);

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
}
