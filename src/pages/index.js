import About from "@/components/About";
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

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const locomotiveScroll = new LocomotiveScroll();

      setTimeout(() => {
        setIsLoading(false);
        document.body.style.cursor = "default";
        window.scrollTo(0, 0);
      }, 2000);
    })();
  }, []);

  return (
    <main className={inter.className}>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader />}
      </AnimatePresence>
      <Inner className="" backgroundColor="#ec4e39">
        <Hero />
        <About />
        <Projects />
        <SlidingImages />
        <Contact />
      </Inner>
    </main>
  );
}
