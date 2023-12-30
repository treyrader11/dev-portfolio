"use client";

import { useRef, useLayoutEffect } from "react";
import styles from "./classnames";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { cn } from "@/lib/utils";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";

export default function Slider({ text }) {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);

  let xPercent = 0;
  // let direction = -1;
  // The warning you're seeing is related to the usage of the `direction` variable inside the `useLayoutEffect` hook. The warning suggests that assignments to the `direction` variable inside the hook will be lost after each render. To preserve the value over time, you can store it in a `useRef` hook and access the mutable value from the `.current` property.
  const direction = useRef(-1);

  //need to look into this
  // useIsomorphicLayoutEffect(() => {
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
  }, []);

  const animate = () => {
    if (xPercent < -100) {
      xPercent = 0;
    } else if (xPercent > 0) {
      xPercent = -100;
    }
    gsap.set(firstText.current, { xPercent: xPercent });
    gsap.set(secondText.current, { xPercent: xPercent });
    requestAnimationFrame(animate);
    xPercent += 0.1 * direction.current;
  };
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
