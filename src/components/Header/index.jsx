"use client";

import { useRef, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Nav from "./nav";
import NavMenu from "./nav/NavMenu";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import ProfilePicture from "@/components/ProfilePicture";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Brand from "@/components/Brand";
import BurgerMenu from "./BurgerMenu";
import { useIsMobile } from "@/hooks/useWindowDimensions";
import BlurredIn from "../BlurredIn";
import { useNav } from "../providers/NavProvider";
import { slideDown, blur } from "./motion";
import { motion } from "framer-motion";

export default function Header() {
  // const { isNavOpen, setIsNavOpen } = useNav();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const header = useRef(null);
  const button = useRef(null);

  const path = usePathname();

  const isMobile = useIsMobile();
  const showButton = isMobile && isNavOpen;

  const isProjectPage = path.includes("project");
  const backgroundHasColor = !isProjectPage;

  const isHomePage = path === "/";
  const headerVariants = isHomePage ? slideDown : blur;

  const handleNavMenu = useCallback(() => {
    setIsNavOpen((prevIsNavOpen) => !prevIsNavOpen);
  }, []);

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (showButton) {
      gsap.to(button.current, { scale: 1, duration: 0.25, ease: "power1.out" });
    } else {
      gsap.to(button.current, { scale: 0, duration: 0.25, ease: "power1.out" });
    }

    ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: window.innerHeight,
      onLeave: () => {
        if (!showButton) {
          gsap.to(button.current, {
            scale: 1,
            duration: 0.25,
            ease: "power1.out",
          });
        }
      },
      onEnterBack: () => {
        if (!showButton) {
          gsap.to(button.current, {
            scale: 0,
            duration: 0.25,
            ease: "power1.out",
          });
          setIsNavOpen(false);
        }
      },
    });

    return () => {
      ScrollTrigger.refresh();
    };
  }, [showButton]);

  return (
    <>
      <motion.header
        variants={headerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        // once
        ref={header}
        className={cn("absolute flex z-[4] w-full")}
      >
        <div
          // variants={blur} // need header conditional header variants if home page slide down else blur
          // initial="hidden"
          // whileInView="show"
          // viewport={{ once: true }}
          className={cn(
            "flex",
            "top-0",
            "font-extralight",
            "text-white",
            "p-[35px]",
            "justify-between",
            "items-center",
            "w-full",
            // "relative"
          )}
        >
          <ProfilePicture
            isMagnetic
            src={`/images/portraits/headshot.png`}
            className="size-20"
            isBlob
          />

          <Brand
            className={cn(
              "pl-3",
              "mr-auto",
              backgroundHasColor ? "text-white" : "text-gray-500"
            )}
          />

          <NavMenu
            handleNavMenu={handleNavMenu}
            backgroundHasColor={backgroundHasColor}
          />
        </div>
      </motion.header>
      <AnimatePresence mode="wait">{isNavOpen && <Nav />}</AnimatePresence>
      <BurgerMenu
        isOpen={isNavOpen}
        handleNavMenu={handleNavMenu}
        ref={button}
      />
    </>
  );
}
