"use client";

import styles from "./styles";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
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
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();
  const button = useRef(null);

  useEffect(() => {
    if (isActive) setIsActive(false);
  }, [pathname, isActive]);

  // useIsomorphicLayoutEffect(() => {
  useLayoutEffect(() => {
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
            setIsActive(false)
          );
        },
      },
    });
  }, []);

  return (
    <>
      <div ref={header} className={styles.header}>
        <Logo />
        <NavMenu className={styles.nav} />

        <div ref={button} className={styles.headerButtonContainer}>
          <Rounded
            onClick={() => {
              setIsActive(!isActive);
            }}
            className={styles.button}
          >
            <div className={styles.burger({ isActive })}></div>
          </Rounded>
        </div>
      </div>
      <AnimatePresence mode="wait">{isActive && <Nav />}</AnimatePresence>
    </>
  );
}
