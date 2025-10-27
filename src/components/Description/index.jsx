"use client";

import { useInView, motion } from "framer-motion";
import { slideUp, opacity } from "./anim";
import Rounded from "@/components/Rounded";
import { useRef } from "react";
import { cn } from "@/lib/utils";

// ============================================
// BRIEF ARTFUL DESCRIPTIONS FOR SENIOR ROLES
// ============================================

export default function Description({ scrollYProgress, className }) {
  const phrase =
    "Building exceptional mobile experiences that matter. Leading teams, architecting solutions, delivering impact.";

  const description = useRef(null);
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
export function DescriptionLeadership({ scrollYProgress, className }) {
  const phrase =
    "Architecting mobile solutions at scale. Leading with vision, delivering with precision.";

  const description = useRef(null);
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
          React Native • TypeScript • Leadership.
        </motion.p>

        <div data-scroll data-scroll-speed={1}>
          <AboutButton />
        </div>
      </div>
    </motion.section>
  );
}

// OPTION 3: Elegant & Poetic
export function DescriptionElegant({ scrollYProgress, className }) {
  const phrase =
    "Crafting digital experiences that feel native, perform flawlessly, inspire constantly.";

  const description = useRef(null);
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
export function DescriptionBold({ scrollYProgress, className }) {
  const phrase = "Excellence in mobile architecture. Innovation in execution.";

  const description = useRef(null);
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
export function DescriptionImpact({ scrollYProgress, className }) {
  const phrase =
    "Transforming complexity into clarity. Building products users love.";

  const description = useRef(null);
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
          React Native • AI Integration • Performance.
        </motion.p>

        <div data-scroll data-scroll-speed={1}>
          <AboutButton />
        </div>
      </div>
    </motion.section>
  );
}

function AboutButton({ className }) {
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

// ============================================
// BRIEF PHRASE OPTIONS FOR SENIOR ROLES
// ============================================
/*
Choose from these artful, brief phrases:

MINIMALIST & POWERFUL:
✓ "Building exceptional mobile experiences that matter. Leading teams, architecting solutions, delivering impact."
- "Excellence in mobile architecture. Innovation in execution."
- "Crafting the future of mobile. One elegant solution at a time."
- "Senior architect. Mobile specialist. Problem solver."

LEADERSHIP FOCUSED:
- "Architecting mobile solutions at scale. Leading with vision, delivering with precision."
- "Driving technical excellence through thoughtful architecture and team leadership."
- "Leading mobile innovation. Building teams. Delivering results."

ELEGANT & ARTFUL:
- "Crafting digital experiences that feel native, perform flawlessly, inspire constantly."
- "Where engineering excellence meets thoughtful design. Senior React Native architect."
- "Building the intersection of performance, elegance, and scale."
- "Mobile architecture that stands the test of time."

BOLD & DIRECT:
- "Transforming complexity into clarity. Building products users love."
- "Senior mobile architect solving hard problems with elegant solutions."
- "Pushing boundaries in mobile development. Delivering exceptional results."

IMPACT-DRIVEN:
- "Creating mobile experiences that drive business forward."
- "Senior architect building the mobile products of tomorrow."
- "Bridging vision and execution in mobile development."

VERY SHORT (High Impact):
- "Excellence in mobile. Innovation in code."
- "Building what matters. Leading with purpose."
- "Senior architect. Mobile excellence."
- "Crafting mobile solutions at scale."

Supporting text should be ONE short sentence:
- "Senior mobile architect specializing in React Native. Transforming complex challenges into elegant, performant solutions."
- "Senior developer driving technical excellence in mobile architecture. React Native • TypeScript • Leadership."
- "Where engineering excellence meets thoughtful design. Senior React Native architect."
- "Senior React Native developer building the future of mobile. 8+ years architecting solutions that scale."
- "Senior mobile architect solving hard problems with elegant solutions. React Native • AI Integration • Performance."
*/
