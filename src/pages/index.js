import Contact from "@/components/Contact";
import Description from "@/components/Description";
import Landing from "@/components/Landing";
import Preloader from "@/components/Preloader";
import Projects from "@/components/Projects";
import SlidingImages from "@/components/SlidingImages";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import Curve from "@/components/Layout/Curve";

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
      {/* <Curve backgroundColor={"#141516"}> */}
      <Curve>
        <Landing />
        <Description />
        <Projects />
        <SlidingImages />
        <Contact />
      </Curve>
    </main>
  );
}
