"use client";

import { useRef, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Nav from "./nav";
import Rounded from "@/common/Rounded";
import NavMenu from "./nav/NavMenu";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import ProfilePicture from "@/common/ProfilePicture";
import profilePicture from "/public/images/portraits/headshot-sit-blackbg.png";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Brand from "@/common/Brand";
import BurgerMenu from "./BurgerMenu";

export default function Header() {
  const header = useRef(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const button = useRef(null);
  const path = usePathname();

  const isHomePage = path === "/";
  const isPortfolioPage = path === "/portfolio";
  const isContactPage = path.includes("contact");

  const handleNavMenu = useCallback(() => {
    setIsNavOpen((prevIsNavOpen) => !prevIsNavOpen);
  }, []);

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(button.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        start: 0,
        end: window.innerHeight,
        onLeave: () => {
          gsap.to(button.current, {
            scale: 1,
            duration: 0.25,
            ease: "power1.out",
          });
        },
        onEnterBack: () => {
          gsap.to(
            button.current,
            { scale: 0, duration: 0.25, ease: "power1.out" },
            setIsNavOpen(false)
          );
        },
      },
    });
  }, []);

  return (
    <>
      <div
        ref={header}
        className={cn(
          "absolute",
          "flex",
          "items-center",
          "z-[5]",
          // isNavOpen ? "z-0" : "z-[5]",
          "top-0",
          "font-extralight",
          "text-white",
          "p-[35px]",
          "justify-between",
          "items-center",
          "w-full"
          // "bg-dark"
        )}
      >
        <ProfilePicture
          isMagnetic
          src={profilePicture}
          className="size-[100px]"
        />
        <Link
          href="/"
          className={cn("pl-3", "mr-auto", "text-black", {
            "text-white": isHomePage || isContactPage || isPortfolioPage,
          })}
        >
          <Brand />
        </Link>

        <NavMenu
          handleNavMenu={handleNavMenu}
          className={cn(
            isHomePage || isContactPage || isPortfolioPage
              ? "text-white"
              : "text-black"
          )}
        />

        <BurgerMenu
          isOpen={isNavOpen}
          handleNavMenu={handleNavMenu}
          ref={button}
        />
      </div>
      <AnimatePresence mode="wait">{isNavOpen && <Nav />}</AnimatePresence>
    </>
  );
}
