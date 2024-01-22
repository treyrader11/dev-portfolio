import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Preloader from "@/components/Preloader";
import SlidingImages from "@/components/SlidingImages";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
// import Curve from "@/components/Layout/Curve";
// import Stairs from "@/components/Layout/Stairs";
import Inner from "@/components/Layout/Inner";
import ProjectsContainer from "@/components/ProjectsParallax";

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
      {/* inline style overrides classname */}
      {/* tailwind don't apply to inline style */}
      <Inner className="bg-red-400" backgroundColor="">
        <Hero />
        <About />
        {/* <Projects /> */}
        <ProjectsContainer />
        <SlidingImages />
        <Contact />
      </Inner>
    </main>
  );
}
