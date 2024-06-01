"use client";

import { useScroll, motion, useTransform } from "framer-motion";
import { useRef, forwardRef } from "react";

function ParalaxScrollText({ text, style, className, scrollYProgress }, ref) {
  const container = useRef();

  // const { scrollYProgress } = useScroll({
  //   target: container,
  //   offset: ["start start", "end end"],
  // });

  return (
    <div className={className} ref={ref || container}>
      <p className="m-0 mt-2.5 text-[3vw] uppercase">
        {text.split("").map((letter, i) => {
          const y = useTransform(
            scrollYProgress,
            [0, 1],
            [0, Math.floor(Math.random() * -75) - 25]
          );
          return (
            <motion.span className="relative" style={{ top: y }} key={`l_${i}`}>
              {letter}
            </motion.span>
          );
        })}
      </p>
    </div>
  );
}

export default forwardRef(ParalaxScrollText);
