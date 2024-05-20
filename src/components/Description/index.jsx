"use client";

import { useInView, motion } from "framer-motion";
import { slideUp, opacity } from "./anim";
import Rounded from "@/components/Rounded";
import { useRef } from "react";

export default function Description() {
  // const phrase =
  //   "Helping brands to stand out in the digital era. Together we will set the new status quo. No nonsense, always on the cutting edge.";
  const phrase =
    "One beautiful aspect of coding is that, when comparing it to a vast majority of other professions, learning is endless, whether it be discovering a new technique or a new technology.";
  // const phrase =
  // "Determined Software engineer";
  const description = useRef(null);
  const isInView = useInView(description);

  return (
    <section
      ref={description}
      className="px-[200px] mt-[200px] flex justify-center"
    >
      <div className="flex gap-[50px] relative max-w-[1400px]">
        <p className="m-0 text-4xl gap-2 leading-[1.3]">
          {phrase.split(" ").map((word, index) => {
            return (
              // Mask
              <span
                key={index}
                className="relative inline-flex overflow-hidden"
              >
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
          className="w-4/5 m-0 text-lg"
        >
          The combination of my passion for design, code & interaction positions
          me in a unique place in the web design world.
        </motion.p>
        <div data-scroll data-scroll-speed={0.1}>
          <div className="absolute right-0 top-3/4">
            <Rounded
              backgroundColor="#131316"
              text="About me"
              href="/info"
              className="size-[180px] bg-dark-400"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
