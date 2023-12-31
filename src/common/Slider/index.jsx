"use client";

import { useRef, useCallback } from "react";
import styles from "./styles";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { cn } from "@/lib/utils";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";

export default function Slider({ text }) {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);

  const xPercent = useRef(0);
  const direction = useRef(-1);

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
  }, [firstText, secondText, direction]);

  useIsomorphicLayoutEffect(() => {
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
    <div ref={slider} className={styles.slider}>
      <p ref={firstText} className={styles.p}>
        {text}
      </p>
      <p
        ref={secondText}
        className={cn(styles.p, "absolute", "top-0", "left-full")}
      >
        {text}
      </p>
    </div>
  );
}
