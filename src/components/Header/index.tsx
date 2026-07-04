"use client";

import { useRef, useCallback, useEffect, useState } from "react";
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
  const { isNavOpen, setIsNavOpen } = useNav();

  const header = useRef<HTMLElement>(null);
  const button = useRef<HTMLDivElement>(null);

  const path = usePathname();

  const isMobile = useIsMobile();
  const showButton = isMobile && isNavOpen;

  const isProjectPage = path.includes("project");
  // Portfolio detail pages (/portfolio/<slug>) have a white background too, so
  // the nav/brand need dark text there like the project pages — otherwise the
  // white links sit invisibly on white. The portfolio index (/portfolio) keeps
  // its white text.
  const isPortfolioDetail = path.startsWith("/portfolio/");
  const backgroundHasColor = !isProjectPage && !isPortfolioDetail;

  const isHomePage = path === "/";
  const headerVariants = isHomePage ? slideDown : blur;

  const handleNavMenu = useCallback(() => {
    setIsNavOpen((prevIsNavOpen) => !prevIsNavOpen);
  }, []);

  // Avatar comes from the CMS (falls back to the bundled headshot). Fetched
  // client-side so this global header doesn't need per-page server props.
  const [avatar, setAvatar] = useState("/images/portraits/headshot.png");
  useEffect(() => {
    let active = true;
    fetch("/api/avatar")
      .then((r) => r.json())
      .then((d) => {
        if (active && d?.url) setAvatar(d.url);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // The burger's scale is driven imperatively so one value can combine two
  // inputs without them fighting (which is what caused the blink/resize when
  // toggling the nav): the scroll reveal (tied 1:1 to scroll position, so it
  // scales in/out at the speed you scroll) and the mobile nav-open state (the
  // burger becomes the close X, so it must be full size). We always apply
  // max(scrollScale, navOpen ? 1 : 0), so neither input can shrink the other and
  // nothing ever hard-resets the scale.
  const scrollScale = useRef(0);
  const navForcing = useRef(false);
  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const setScale = gsap.quickSetter(button.current, "scale") as (
      v: number,
    ) => void;
    const apply = () =>
      setScale(Math.max(scrollScale.current, navForcing.current ? 1 : 0));

    const st = ScrollTrigger.create({
      trigger: header.current,
      // Reveal starts the moment the header's bottom passes the top of the
      // viewport and completes 120px of scroll later.
      start: "bottom top",
      end: "+=120",
      onUpdate: (self) => {
        scrollScale.current = self.progress;
        if (!navForcing.current) apply();
      },
      // Pin the extremes so a fast fling can't leave the burger a hair under or
      // over full size.
      onLeave: () => {
        scrollScale.current = 1;
        if (!navForcing.current) apply();
      },
      onLeaveBack: () => {
        scrollScale.current = 0;
        if (!navForcing.current) apply();
        setIsNavOpen(false);
      },
    });
    apply();

    return () => st.kill();
  }, []);

  // Ease to the combined target whenever the nav open state flips: opening grows
  // the X in, closing eases back to the scroll-driven size. No hard reset, so no
  // blink.
  useIsomorphicLayoutEffect(() => {
    navForcing.current = showButton;
    const target = Math.max(scrollScale.current, showButton ? 1 : 0);
    gsap.to(button.current, { scale: target, duration: 0.25, ease: "power1.out" });
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
          className={cn(
            "flex",
            "top-0",
            "font-extralight",
            "text-white",
            "p-[35px]",
            "justify-between",
            "items-center",
            "w-full",
          )}
        >
          <ProfilePicture
            isMagnetic
            src={avatar}
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
      <AnimatePresence mode="wait">
        {isNavOpen && <Nav onClose={() => setIsNavOpen(false)} />}
      </AnimatePresence>
      <BurgerMenu
        isOpen={isNavOpen}
        handleNavMenu={handleNavMenu}
        ref={button}
      />
    </>
  );
}
