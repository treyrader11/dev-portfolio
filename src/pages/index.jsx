import Preloader from "@/components/Preloader";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import Inner from "@/common/layout/Inner";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import Description from "@/components/Home/components/Description";
import SlidingImages from "@/components/Home/components/SlidingImages";
import Projects from "@/components/Home/components/Projects";
import Hero from "@/components/Home/components/Hero";

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
        {isLoading && <Preloader />}
      </AnimatePresence>
      <Inner backgroundColor="#934E00">
        <Hero isLoading={isLoading} />
        <Description />
        <Projects />
        <SlidingImages />
        <Footer />
      </Inner>
    </main>
  );
}
