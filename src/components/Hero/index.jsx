"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import useMousePosition from "@/hooks/useMousePosition";
import styles from "./styles";
import { cn } from "@/lib/utils";

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 400 : 40;

  return (
    <section className={styles.container}>
      <motion.div
        className={cn(styles.mask, "mask")}
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
          className={cn(styles.p)}
        >
          Developing the web for<span className="text-light-400"> 7 years</span>{" "}
          and making good shit only if the paycheck is equally good.
        </p>
      </motion.div>

      <div className={styles.body}>
        <p className={styles.p}>
          I&lsquo;m a{" "}
          <span className="text-[#ec4e39]">selectively skilled</span> web
          developer with a strong focus on producing quality & impactful digital
          experiences.
        </p>
      </div>
    </section>
  );
}
