"use client";

import { useInView, motion } from "framer-motion";
import { useRef } from "react";
import { slideUp, opacity } from "./anim";
import Rounded from "@/common/Rounded";
import styles from "./styles";
import Container from "@/common/Container";
import { cn } from "@/lib/utils";

export default function Description() {
  const phrase =
    "Helping brands to stand out in the digital era. Together we will set the new status quo. No nonsense, always on the cutting edge.";
  const description = useRef(null);
  const isInView = useInView(description);
  return (
    <section ref={description} className={cn(styles.description)}>
      <Container maxWidth={1400} classname={styles.container}>
      {/* <div classname={cn(styles.container, "max-w-[1400px]")}> */}
        <p className={cn(styles.p, "text-[36px]", "gap-[8px]", "leading-[1.3]")}>
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
          className={cn(styles.p, "text-[18px]", "w-[80%]")}
        >
          The combination of my passion for design, code & interaction positions
          me in a unique place in the web design world.
        </motion.p>
        <div data-scroll data-scroll-speed={0.1}>
          <Rounded className={styles.button}>
            <p className={cn(styles.p, styles.buttonText)}>About me</p>
            {/* <p>About me</p> */}
          </Rounded>
        </div>
      {/* </div> */}
      </Container>
    </section>
  );
}
