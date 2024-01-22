"use client";

import styles from "./styles";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Nav from "./nav";
import Rounded from "@/common/Rounded";
import NavMenu from "./NavMenu";
import Logo from "../Logo";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";

export default function Header() {
  const header = useRef(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const pathname = usePathname();
  const button = useRef(null);

  useEffect(() => {
    if (isNavOpen) setIsNavOpen(false);
  }, [pathname]);

  // sliding nav logic
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
        <Logo />
        <NavMenu />

        <div ref={button} className={styles.headerButtonContainer}>
          <Rounded
            onClick={() => setIsNavOpen(!isNavOpen)}
            className={styles.button}
          >
            <div className={styles.burger({ isNavOpen })} />
          </Rounded>
        </div>
      </div>
      <AnimatePresence mode="wait">{isNavOpen && <Nav />}</AnimatePresence>
    </>
  );
}
