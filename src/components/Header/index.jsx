"use client";

import { useRef, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Nav from "./nav";
import NavMenu from "./nav/NavMenu";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import ProfilePicture from "@/components/ProfilePicture";
import profilePicture from "/public/images/portraits/headshot-sit-blackbg.png";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Brand from "@/components/Brand";
import BurgerMenu from "./BurgerMenu";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import BlurredIn from "../BlurredIn";

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const header = useRef(null);
  const button = useRef(null);

  const path = usePathname();

  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const showButton = isMobile && isNavOpen;

  const isProjectPage = path.includes("project");

  const backgroundHasColor = !isProjectPage;

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
      <BlurredIn
        once
        ref={header}
        className={cn(
          "absolute",
          "flex",
          "z-[4]",
          "top-0",
          "font-extralight",
          "text-white",
          "p-[35px]",
          "justify-between",
          "items-center",
          "w-full"
        )}
      >
        <ProfilePicture
          isMagnetic
          src={profilePicture}
          className="size-[100px]"
        />
        <Link
          href="/"
          className={cn(
            "pl-3",
            "mr-auto",
            backgroundHasColor ? "text-white" : "text-gray-500"
          )}
        >
          <Brand />
        </Link>

        <NavMenu
          handleNavMenu={handleNavMenu}
          backgroundHasColor={backgroundHasColor}
        />
      </BlurredIn>
      <AnimatePresence mode="wait">{isNavOpen && <Nav />}</AnimatePresence>
      <BurgerMenu
        isOpen={isNavOpen}
        handleNavMenu={handleNavMenu}
        ref={button}
      />
    </>
  );
}
