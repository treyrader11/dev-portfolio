"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ONE_SECOND = 1000;
const WAIT_TIME = ONE_SECOND * 5;
const STAGGER = 0.025;

export function Vanish({ phrases, className, delay = 0, once = false }) {
  const countRef = useRef(0);
  const [active, setActive] = useState(0);

  const variants = {
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: delay || countRef.current * STAGGER,
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    exit: {
      opacity: 0,
      scale: 0,
    },
  };

  useEffect(() => {
    const intervalRef = setInterval(() => {
      setActive((pv) => (pv + 1) % phrases.length);
    }, WAIT_TIME);

    return () => clearInterval(intervalRef);
  }, [phrases]);

  return (
    <div className={cn("gap-1.5 sm:gap-2", className)}>
      <AnimatePresence mode="popLayout">
        {phrases[active]?.split(" ").map((word, wordIndex) => {
          if (wordIndex === 0) countRef.current = 0;

          return (
            <motion.div key={word + wordIndex} className="inline-flex">
              {word.split("").map((letter, letterIndex) => {
                const content = (
                  <motion.span
                    variants={variants}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView="animate"
                    viewport={{ once }}
                    key={letter + letterIndex}
                  >
                    {letter}
                  </motion.span>
                );

                countRef.current++;
                return content;
              })}
              {wordIndex < phrases[active].split(" ").length - 1 && (
                <span>&nbsp;</span>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
