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

  // Built once and kept alive. The burger's scale is scrubbed directly to scroll
  // position: it begins scaling in the moment the header's bottom passes the top
  // of the viewport and is fully in 120px of scroll later. scrub ties it 1:1 to
  // the scroll, so it reveals/hides at exactly the speed the user scrolls and
  // reverses symmetrically on the way back up.
  const scrubTween = useRef<gsap.core.Tween | null>(null);
  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tween = gsap.fromTo(
      button.current,
      { scale: 0 },
      {
        scale: 1,
        ease: "none",
        // Let ScrollTrigger set the initial scale from the current scroll
        // position instead of flashing the scale-0 from-state on creation.
        immediateRender: false,
        scrollTrigger: {
          trigger: header.current,
          start: "bottom top",
          end: "+=120",
          scrub: true,
          onLeaveBack: () => setIsNavOpen(false),
        },
      },
    );
    scrubTween.current = tween;

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      scrubTween.current = null;
    };
  }, []);

  // The scrub trigger is created once and never rebuilt, so opening/closing the
  // nav can't resize the burger. While the mobile nav is open the burger is the
  // close (X) button: pause the scrub so scroll can't shrink it and pin it fully
  // visible. On close, resume the scrub and re-sync its scale to the current
  // scroll position (full if you're scrolled down, hidden if you're at the top).
  useIsomorphicLayoutEffect(() => {
    const st = scrubTween.current?.scrollTrigger;
    if (!st) return;
    if (showButton) {
      st.disable(false);
      gsap.to(button.current, { scale: 1, duration: 0.25, ease: "power1.out" });
    } else {
      st.enable();
      st.refresh();
    }
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
