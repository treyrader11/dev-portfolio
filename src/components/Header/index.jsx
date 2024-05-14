"use client";

import { useRef, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Nav from "./nav";
import Rounded from "@/common/Rounded";
import NavMenu from "./NavMenu";
import Copyright from "../Copyright";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import ProfilePicture from "@/common/ProfilePicture";
import profilePicture from "/public/images/portraits/headshot-sit-blackbg.png";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

const styles = {
  header: cn(
    "absolute",
    "flex",
    "z-[5]",
    "top-0",
    "font-extralight",
    "text-white",
    "p-[35px]",
    "justify-between",
    "items-center",
    "w-full"
  ),
  logo: (isHomePage) =>
    cn("pl-3", "mr-auto", isHomePage ? "text-white" : "text-black"),
  navMenu: (isHomePage) => cn(isHomePage ? "text-white" : "text-black"),
  navButtonContainer: cn(
    "fixed",
    "transform",
    "scale-0",
    "right-0",
    // "z-[10]",
    "z-[4]",
    "after:top-[-5px]",
    "before:top-[5px]"
  ),
  navButton: (isNavOpen) =>
    cn(
      "relative",
      "m-5",
      "w-[80px]",
      "h-[80px]",
      "rounded-full",
      "cursor-pointer",
      isNavOpen ? cn("bg-[#934E00]") : cn("bg-dark-400")
    ),

  burger: (isNavOpen) =>
    cn(
      "relative",
      "w-full",
      "z-[1]",
      // first line
      "after:block",
      "after:h-[1px]",
      "after:w-[40%]",
      "after:m-auto",
      "after:bg-white",
      "after:relative",
      "after:transition-transform",
      "after:duration-300",
      // second line
      "before:block",
      "before:h-0.5",
      "before:w-[40%]",
      "before:m-auto",
      "before:bg-white",
      "before:relative",
      "before:transition-transform",
      "before:duration-300",
      isNavOpen
        ? cn(
            "after:transform",
            "after:rotate-45",
            "after:-top-[1px]",
            "before:-rotate-45",
            "before:top-0"
          )
        : cn("after:-top-[5px]", "before:top-[5px]")
    ),
};

export default function Header() {
  const header = useRef(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const button = useRef(null);
  const path = usePathname();

  const isHomePage = path === "/";

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
          "z-[5]",
          "top-0",
          "font-extralight",
          "text-white",
          "p-[35px]",
          "justify-between",
          "items-center",
          "w-full",
          // "bg-dark"

        )}
      >
        <ProfilePicture
          isMagnetic
          src={profilePicture}
          height={80}
          width={80}
        />
        <Link
          href="/"
          className={cn("pl-3", "mr-auto", "text-black", {
            "text-white": isHomePage,
          })}
        >
          <Copyright />
        </Link>

        <NavMenu
          handleNavMenu={handleNavMenu}
          className={cn(isHomePage ? "text-white" : "text-black")}
        />
        <div
          ref={button}
          className={cn(
            "fixed",
            "transform",
            "scale-0",
            "right-0",
            // "z-[10]",
            "z-[4]",
            "after:top-[-5px]",
            "before:top-[5px]"
          )}
        >
          <Rounded
            onClick={handleNavMenu}
            className={cn(
              "relative",
              "m-5",
              "w-[80px]",
              "h-[80px]",
              "rounded-full",
              "cursor-pointer",
              "bg-dark-400",
              { "bg-neutral-800": isNavOpen }
            )}
          >
            <BurgerMenu isOpen={isNavOpen} />
          </Rounded>
        </div>
      </div>
      <AnimatePresence mode="wait">{isNavOpen && <Nav />}</AnimatePresence>
    </>
  );
}

export function BurgerMenu({ isOpen }) {
  return (
    <div
      className={cn(
        "relative",
        "w-full",
        "z-[1]",
        // first line
        "after:block",
        "after:h-px",
        "after:w-[40%]",
        "after:m-auto",
        "after:bg-white",
        "after:relative",
        "after:transition-transform",
        "after:duration-300",
        // second line
        "before:block",
        "before:h-px",
        "before:w-[40%]",
        "before:m-auto",
        "before:bg-white",
        "before:relative",
        "before:transition-transform",
        "before:duration-300",
        isOpen
          ? cn(
              "after:transform",
              "after:rotate-45",
              "after:-top-[1px]",
              "before:-rotate-45",
              "before:top-0"
            )
          : cn("after:-top-[5px]", "before:top-[5px]")
      )}
    />
  );
}
