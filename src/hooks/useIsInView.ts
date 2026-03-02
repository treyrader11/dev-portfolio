"use client";

import { useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

export function useIsInView(
  container: string | Element | null | undefined,
  el: string | Element | null | undefined,
  yPos: string | number
): boolean {
  const [isInView, setIsInView] = useState<boolean>(false);

  if (el) {
    gsap.to(el, { scale: 0, duration: 0.25, ease: "power1.out" });
  }

  useLayoutEffect(() => {
    if (!el || !container) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(el, {
      scrollTrigger: {
        trigger: container,
        start: yPos,
        end: window.innerHeight,
        onLeave: () => {
          gsap.to(el, {
            scale: 1,
            duration: 0.25,
            ease: "power1.out",
          });
        },
        onEnterBack: () => {
          gsap.to(el, {
            scale: 0,
            duration: 0.25,
            ease: "power1.out",
            onComplete: () => setIsInView(false),
          });
        },
      },
    });
  }, [container, el, yPos]);

  return isInView;
}
