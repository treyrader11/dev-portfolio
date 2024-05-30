import Preloader from "@/components/Preloader";
import { AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Inter } from "next/font/google";
import Inner from "@/components/layout/Inner";
import { cn } from "@/lib/utils";
import Description from "@/components/Description";
import SlidingImages from "@/components/SlidingImages";
import RecentProjects from "@/components/RecentProjects";
import Hero from "@/components/Hero";
import { useScroll, useTransform } from "framer-motion";
import PositionProvider from "@/components/providers/PositionProvider";
import References from "@/components/References";
import PageCurve from "@/components/PageCurve";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const container = useRef();

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const locomotiveScroll = new LocomotiveScroll();

      setTimeout(() => {
        setIsLoading(false);
        document.body.style.cursor = "default";
        window.scrollTo(0, 0);
        // }, 2000);
      }, 800);
    })();
  }, []);

  return (
    <main className={cn(inter.className, "overflow-clip")}>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader />}
      </AnimatePresence>
      <Inner ref={container} backgroundColor="#934E00">
        <Hero
          isLoading={isLoading}
          scrollYProgress={scrollYProgress}
          className="sticky top-0 min-h-screen"
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

        <div className={cn("relative", "z-[3]", "min-h-screen")}>
          <References />
          <SlidingImages className="bg-white" />
        </div>

        {/* <div className={cn("bg-white h-[5vh]")} />
        <PageCurve height={height} /> */}
      </Inner>
    </main>
  );
}
