"use client";

import { useState, useRef } from "react";
import { useInView, motion } from "framer-motion";
import useMousePosition from "@/hooks/useMousePosition";
import styles from "./styles";
import { cn } from "@/lib/utils";
import { slideUp } from "./anim";

const phrase =
  "I'm a selectively skilled web developer focusing on delivering quality & impactful digital experiences.";

const targetedWords = phrase
  .split(" ")
  .filter((word) => word.includes("selectively") || word.includes("skilled"));

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 400 : 40;
  const hero = useRef(null);
  const isInView = useInView(hero);

  return (
    <section ref={hero} className={styles.container}>
      <motion.div
        className={styles.mask}
        animate={{
          WebkitMaskPosition: `${x - size / 2}px ${y - size / 2}px`,
          WebkitMaskSize: `${size}px`,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
      >
        <p
          onMouseEnter={() => {
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
          className={cn(styles.p, "mt-[9%]")}
        >
          Developing the web for<span className="text-light-400"> 7 years</span>{" "}
          and making good shit only if the paycheck is equally good.
        </p>
      </motion.div>

      <div className={styles.body}>
        <p className={cn(styles.p, "mt-[20%]")}>
          {phrase.split(" ").map((word, index) => {
            const isTargetedWord = targetedWords.includes(word.toLowerCase());

            return (
              <motion.span
                variants={slideUp}
                custom={index}
                animate={isInView ? "open" : "closed"}
                key={index}
                className={styles.heading(isTargetedWord)}
              >
                {word}
              </motion.span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
