"use client";

import styles from "./styles";
import { useRef, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Nav from "./nav";
import Rounded from "@/common/Rounded";
import NavMenu from "./NavMenu";
import Logo from "../Logo";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import ProfilePicture from "@/common/ProfilePicture";
import profilePicture from "/public/images/portraits/headshot-sit-blackbg.png";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
      <div ref={header} className={styles.header}>
        <ProfilePicture
          isMagnetic
          src={profilePicture}
          height={80}
          width={80}
        />
        <Link href="/" className={styles.logo(isHomePage)}>
          <Logo />
        </Link>

        <NavMenu
          handleNavMenu={handleNavMenu}
          className={styles.navMenu(isHomePage)}
        />
        <div ref={button} className={styles.navButtonContainer}>
          <Rounded
            onClick={handleNavMenu}
            className={cn(styles.navButton(isNavOpen))}
          >
            <div className={styles.burger(isNavOpen)} />
          </Rounded>
        </div>
      </div>
      <AnimatePresence mode="wait">{isNavOpen && <Nav />}</AnimatePresence>
    </>
  );
}
