import Description from "@/components/home/components/Description";
import Contact from "@/components/Footer/components/Contact";
import Preloader from "@/components/Preloader";
import SlidingImages from "@/components/home/components/SlidingImages";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import Inner from "@/common/layout/Inner";
import Projects from "@/components/home/components/Projects";
import Hero from "@/components/home/components/Hero";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";

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
