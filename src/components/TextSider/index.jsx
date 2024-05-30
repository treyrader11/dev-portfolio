"use client";

import { cn } from "@/lib/utils";
import { useLayoutEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

export default function TextSlider({ text, text2, className }) {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);
  const direction = useRef(-1);
  const xPercent = useRef(0);

  const animate = useCallback(() => {
    if (xPercent.current < -100) {
      xPercent.current = 0;
    } else if (xPercent.current > 0) {
      xPercent.current = -100;
    }
    gsap.set(firstText.current, { xPercent: xPercent.current });
    gsap.set(secondText.current, { xPercent: xPercent.current });
    requestAnimationFrame(animate);
    xPercent.current += 0.1 * direction.current;
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(slider.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.25,
        start: 0,
        end: window.innerHeight,
        onUpdate: (e) => (direction.current = e.direction * -1),
      },
      x: "-500px",
    });
    requestAnimationFrame(animate);
  }, [animate]);

  return (
    <div
      className={cn(
        // "absolute",
        // "-top-[calc(100vh-216vh)]",
        // "xs:-top-[calc(100vh-250vh)]",
        "md:relative",
        "relative",
        "md:inset-0",
        "z-50",
        "border border-red-500",
        className
      )}
    >
      <div
        ref={slider}
        className={cn("relative whitespace-nowrap text-4xl sm:text-6xl")}
      >
        <p
          ref={firstText}
          className={cn(
            "relative",
            "m-0",
            "text-card-foreground",
            "font-bold",
            // "pr-[50px]"
            "pr-6"
          )}
        >
          {text}
        </p>
        <p
          ref={secondText}
          className={cn(
            "absolute",
            "left-full",
            "top-0",
            "m-0",
            "text-card-foreground",
            "font-bold",
            // "pr-[50px]"
            "pr-6"
          )}
        >
          {text2 || text}
        </p>
      </div>
    </div>
  );
}
