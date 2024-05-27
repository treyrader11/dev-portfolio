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
import { useScroll } from "framer-motion";
import PositionProvider from "@/providers/PositionProvider";
import References from "@/components/References";

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
          className={cn("sticky top-0 min-h-[170vh] pt-[20vh] bg-white")}
        />
        <PositionProvider>
          <RecentProjects className="sticky top-0 bg-white" />
        </PositionProvider>

        <div className="relative z-[2] min-h-screen pb-[30vh]">
          <References />
          
          <SlidingImages className="bg-white mt-[200px] absolute bottom-0 " />
        </div>
      
      </Inner>
    </main>
  );
}
