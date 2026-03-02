"use client";

import { useInView, motion, type MotionValue } from "framer-motion";
import { slideUp, opacity } from "./anim";
import Rounded from "@/components/Rounded";
import { useRef } from "react";
import { cn } from "@/lib/utils";

// ============================================
// BRIEF ARTFUL DESCRIPTIONS FOR SENIOR ROLES
// ============================================

interface Props {
  scrollYProgress?: MotionValue<number>;
  className?: string;
}

export default function Description({ scrollYProgress, className }: Props) {
  const phrase =
    "Building exceptional mobile experiences that matter. Leading teams, architecting solutions, delivering impact.";

  const description = useRef<HTMLElement>(null);
  const isInView = useInView(description);

  return (
    <motion.section
      ref={description}
      className={cn("px-[200px] mt-[200px] flex justify-center", className)}
    >
      <div className="flex gap-[50px] relative max-w-[1400px]">
        <p className="m-0 text-4xl gap-2 leading-[1.3]">
          {phrase.split(" ").map((word, index) => (
            <span key={index} className="relative inline-flex overflow-hidden">
              <motion.span
                variants={slideUp}
                custom={index}
                animate={isInView ? "open" : "closed"}
                className="mr-[3px]"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </p>

        <motion.p
          variants={opacity}
          animate={isInView ? "open" : "closed"}
          className="w-4/5 m-0 text-lg"
        >
          Senior mobile architect specializing in React Native. Transforming
          complex challenges into elegant, performant solutions.
        </motion.p>

        <div data-scroll data-scroll-speed={1}>
          <AboutButton />
        </div>
      </div>
    </motion.section>
  );
}

// OPTION 2: Leadership Focused
export function DescriptionLeadership({ scrollYProgress, className }: Props) {
  const phrase =
    "Architecting mobile solutions at scale. Leading with vision, delivering with precision.";

  const description = useRef<HTMLElement>(null);
  const isInView = useInView(description);

  return (
    <motion.section
      ref={description}
      className={cn("px-[200px] mt-[200px] flex justify-center", className)}
    >
      <div className="flex gap-[50px] relative max-w-[1400px]">
        <p className="m-0 text-4xl gap-2 leading-[1.3]">
          {phrase.split(" ").map((word, index) => (
            <span key={index} className="relative inline-flex overflow-hidden">
              <motion.span
                variants={slideUp}
                custom={index}
                animate={isInView ? "open" : "closed"}
                className="mr-[3px]"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </p>

        <motion.p
          variants={opacity}
          animate={isInView ? "open" : "closed"}
          className="w-4/5 m-0 text-lg"
        >
          Senior developer driving technical excellence in mobile architecture.
          React Native - TypeScript - Leadership.
        </motion.p>

        <div data-scroll data-scroll-speed={1}>
          <AboutButton />
        </div>
      </div>
    </motion.section>
  );
}

// OPTION 3: Elegant & Poetic
export function DescriptionElegant({ scrollYProgress, className }: Props) {
  const phrase =
    "Crafting digital experiences that feel native, perform flawlessly, inspire constantly.";

  const description = useRef<HTMLElement>(null);
  const isInView = useInView(description);

  return (
    <motion.section
      ref={description}
      className={cn("px-[200px] mt-[200px] flex justify-center", className)}
    >
      <div className="flex gap-[50px] relative max-w-[1400px]">
        <p className="m-0 text-4xl gap-2 leading-[1.3]">
          {phrase.split(" ").map((word, index) => (
            <span key={index} className="relative inline-flex overflow-hidden">
              <motion.span
                variants={slideUp}
                custom={index}
                animate={isInView ? "open" : "closed"}
                className="mr-[3px]"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </p>

        <motion.p
          variants={opacity}
          animate={isInView ? "open" : "closed"}
          className="w-4/5 m-0 text-lg"
        >
          Where engineering excellence meets thoughtful design. Senior React
          Native architect.
        </motion.p>

        <div data-scroll data-scroll-speed={1}>
          <AboutButton />
        </div>
      </div>
    </motion.section>
  );
}

// OPTION 4: Bold & Direct
export function DescriptionBold({ scrollYProgress, className }: Props) {
  const phrase = "Excellence in mobile architecture. Innovation in execution.";

  const description = useRef<HTMLElement>(null);
  const isInView = useInView(description);

  return (
    <motion.section
      ref={description}
      className={cn("px-[200px] mt-[200px] flex justify-center", className)}
    >
      <div className="flex gap-[50px] relative max-w-[1400px]">
        <p className="m-0 text-4xl gap-2 leading-[1.3]">
          {phrase.split(" ").map((word, index) => (
            <span key={index} className="relative inline-flex overflow-hidden">
              <motion.span
                variants={slideUp}
                custom={index}
                animate={isInView ? "open" : "closed"}
                className="mr-[3px]"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </p>

        <motion.p
          variants={opacity}
          animate={isInView ? "open" : "closed"}
          className="w-4/5 m-0 text-lg"
        >
          Senior React Native developer building the future of mobile. 8+ years
          architecting solutions that scale.
        </motion.p>

        <div data-scroll data-scroll-speed={1}>
          <AboutButton />
        </div>
      </div>
    </motion.section>
  );
}

// OPTION 5: Impact-Driven
export function DescriptionImpact({ scrollYProgress, className }: Props) {
  const phrase =
    "Transforming complexity into clarity. Building products users love.";

  const description = useRef<HTMLElement>(null);
  const isInView = useInView(description);

  return (
    <motion.section
      ref={description}
      className={cn("px-[200px] mt-[200px] flex justify-center", className)}
    >
      <div className="flex gap-[50px] relative max-w-[1400px]">
        <p className="m-0 text-4xl gap-2 leading-[1.3]">
          {phrase.split(" ").map((word, index) => (
            <span key={index} className="relative inline-flex overflow-hidden">
              <motion.span
                variants={slideUp}
                custom={index}
                animate={isInView ? "open" : "closed"}
                className="mr-[3px]"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </p>

        <motion.p
          variants={opacity}
          animate={isInView ? "open" : "closed"}
          className="w-4/5 m-0 text-lg"
        >
          Senior mobile architect solving hard problems with elegant solutions.
          React Native - AI Integration - Performance.
        </motion.p>

        <div data-scroll data-scroll-speed={1}>
          <AboutButton />
        </div>
      </div>
    </motion.section>
  );
}

interface AboutButtonProps {
  className?: string;
}

function AboutButton({ className }: AboutButtonProps) {
  return (
    <div className={cn("absolute right-0 top-[40%] md:top-[35%]", className)}>
      <Rounded
        text="Learn more"
        href="/info"
        className="size-[180px] text-nowrap bg-dark-400"
      />
    </div>
  );
}
