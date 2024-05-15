"use client";

import { useInView, motion } from "framer-motion";
import { slideUp, opacity } from "./anim";
import Rounded from "@/common/Rounded";
import { cn } from "@/lib/utils";
import { useLayoutEffect, useRef } from "react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import gsap from "gsap";
import Link from "next/link";

const styles = {
  description: cn(
    "px-[200px]",
    "mt-[200px]",
    "flex",
    "justify-center"
    // "text-black"
  ),
  container: cn("flex", "gap-[50px]", "relative"),
  mask: cn("relative", "overflow-hidden", "inline-flex"),
  button: cn(
    "top-[80%]",
    "left-[clac(100%_-_400px)]",
    "w-[180px]",
    "h-[180px]",
    "bg-dark-400",
    "text-white",
    "rounded-full",
    "absolute",
    "flex",
    "items-center",
    "justify-center",
    "cursor-pointer"
  ),
  buttonText: cn("m-0", "text-[16px]", "font-light", "relative", "z-[1]"),
  p: cn("m-0"),
  descriptionNew: cn("relative", "text-[3vw]", "uppercase", "ml-[10vw]"),
};

export default function Description() {
  const phrase =
    "Helping brands to stand out in the digital era. Together we will set the new status quo. No nonsense, always on the cutting edge.";
  const description = useRef(null);
  const isInView = useInView(description);

  return (
    <section ref={description} className={cn(styles.description)}>
      <div className={cn(styles.container, "max-w-[1400px]")}>
        <p
          className={cn(styles.p, "text-[36px]", "gap-[8px]", "leading-[1.3]")}
        >
          {phrase.split(" ").map((word, index) => {
            return (
              <span key={index} className={styles.mask}>
                <motion.span
                  variants={slideUp}
                  custom={index}
                  animate={isInView ? "open" : "closed"}
                  key={index}
                  className="mr-[3px]"
                >
                  {word}
                </motion.span>
              </span>
            );
          })}
        </p>
        <motion.p
          variants={opacity}
          animate={isInView ? "open" : "closed"}
          className={cn("m-0 text-lg w-4/5")}
        >
          The combination of my passion for design, code & interaction positions
          me in a unique place in the web design world.
        </motion.p>
        <div data-scroll data-scroll-speed={0.1}>
          <Rounded
            href="/about"
            className={cn(
              "top-[80%]",
              "left-[clac(100%_-_400px)]",
              "size-[180px]",
              "bg-dark-400",
              "absolute"
              // styles.button
            )}
          >
            <p
              className={cn(
                "relative",
                "z-[1]",
                "transition-colors",
                "duration-400",
                "ease-linear"
              )}
            >
              About me
            </p>
          </Rounded>
        </div>
      </div>
    </section>
  );
}

function AnimatedText({ children }) {
  const text = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(text.current, {
      scrollTrigger: {
        trigger: text.current,
        scrub: true,
        start: "0px bottom",
        end: "bottom+=400px bottom",
      },
      opacity: 0,
      left: "-200px",
      // left: "-100px",
      ease: "power3.Out",
    });
  }, []);

  return (
    <p className={cn(styles.p, "text-[36px]", "leading-[1.3]", "relative")}>
      {children}
    </p>
  );
}
