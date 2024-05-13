import Description from "@/components/Description";
import Contact from "@/components/Contact";
import Preloader from "@/components/Preloader";
import SlidingImages from "@/components/SlidingImages";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
// import Curve from "@/components/Layout/Curve";
// import Stairs from "@/components/Layout/Stairs";
import Inner from "@/components/Layout/Inner";
import Projects from "@/components/Projects";
import Hero from "@/components/Hero";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

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
        {isLoading ? (
          <Preloader />
        ) : (
          <Inner backgroundColor="#934E00">
            <Hero isLoading={isLoading} />
            <Description />
            <Projects />
            <SlidingImages />
            <Contact />
          </Inner>
        )}
      </AnimatePresence>
    </main>
  );
}
