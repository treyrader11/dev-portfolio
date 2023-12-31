import Contact from "@/components/Contact";
import About from "@/components/About";
import Landing from "@/components/Landing";
import Preloader from "@/components/Preloader";
import Projects from "@/components/Projects";
import SlidingImages from "@/components/SlidingImages";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import Curve from "@/components/Layout/Curve";
import Stairs from "@/components/Layout/Stairs";

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
      <Stairs>
        <Landing />
        <About />
        <Projects />
        <SlidingImages />
        <Contact />
      </Stairs>
    </main>
  );
}
