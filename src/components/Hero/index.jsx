"use client";

import { useState, useRef } from "react";
import { useInView, motion, useTransform } from "framer-motion";
import useMousePosition from "@/hooks/useMousePosition";
import { cn } from "@/lib/utils";
import { slideUp } from "./anim";
import Image from "next/image";
import BlurredIn from "../BlurredIn";
import FlipWords from "../FlipWords";
import ViewResume from "../ViewResume";

// const phrase =
//   "I'm a selectively skilled web developer focusing on delivering quality & impactful digital experiences.";

const phrase =
  "Experienced product engineer focusing on delivering quality & impactful digital experiences.";

// const targetedWords = phrase
//   .split(" ")
//   .filter((word) => word.includes("selectively") || word.includes("skilled"));

  const targetedWords = phrase
  .split(" ")
  .filter((word) => word.includes("product") || word.includes("engineer"));

export default function Hero({ scrollYProgress, className }) {
  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 400 : 40;
  const hero = useRef(null);
  const resume = useRef(null);

  const isHeroInView = useInView(hero);
  const isResumeInView = useInView(resume);

  //for section transition
  // const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  // const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);

  return (
    <motion.section
      ref={hero}
      // style={{ scale, rotate }}
      className={cn(
        "h-screen",
        "bg-transparent",
        // "custom-font",
        "relative",
        "flex",
        className
      )}
    >
      {/* cursor mask */}
      {/* <motion.div
        className={cn(
          "size-full",
          "flex",
          "items-center",
          "text-3xl",
          "md:text-[64px]",
          "md:leading-[66px]",
          "mask",
          "select-none"
        )}
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
          className={cn("w-[1000px] p-10 mt-[9%]")}
        >
          Developing the web for
          <span className="text-purple-400"> 7 years</span> and making good shit
          only if the paycheck is equally good.
        </p>
      </motion.div> */}

      <div
        // style={{ position: "absolute", zIndex: "1000" }}
        className={cn(
          "size-full",
          "flex",
          "items-center",
          "text-light-400",
          "text-3xl",
          "md:text-[64px]",
          "md:leading-[66px]"
        )}
      >
        <BlurredIn
          className={cn(
            "w-[1000px]",
            "p-10",
            "mt-[20%]",
            // "relative",
            "flex",
            "flex-col",
            "items-center"
          )}
        >
          <div>
            {phrase.split(" ").map((word, i) => {
              const isTargetedWord = targetedWords.includes(word.toLowerCase());

              return (
                <motion.span
                  variants={slideUp}
                  initial={{ opacity: 0, y: 10, filter: "blur(8px)" }} //added as experiemnt not working yet
                  custom={i}
                  // animate={!isLoading ? (isInView ? "open" : "closed") : ""}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  key={i}
                  className={cn("mr-3 inline-flex  text-light-400", {
                    "text-purple-400 text-4xl font-pp-acma": isTargetedWord,
                  })}
                >
                  {isTargetedWord
                    ? word.split("").map((letter, i) => (
                        <motion.span
                          key={word + i}
                          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{
                            delay: i * 0.08,
                            duration: 0.4,
                          }}
                          className="inline-block"
                        >
                          {letter}
                        </motion.span>
                      ))
                    : word}
                </motion.span>
                // <FlipWords words={phrase} />
              );
            })}
          </div>

          {/* <ViewResume
            ref={resume}
            isActive={isResumeInView}
            className={cn("-mb-5")}
          /> */}
        </BlurredIn>

        <div
          className={cn(
            "w-1/2",
            "h-full",
            "hidden",
            "lg:flex",
            "flex-row",
            "items-center",
            "select-none",
            "justify-between"
          )}
        >
          <Image
            src="/icons/mainIconsdark.svg"
            width={708}
            height={709}
            alt="tech stack image"
            className={cn(
              "flex",
              "animate-slideright2",
              "duration-700",
              "transition-all"
            )}
          />
        </div>
      </div>
    </motion.section>
  );
}

export function JumpingIcon({ className, containerClassName }) {
  return (
    <div
      className={cn(
        // "absolute",
        // "xs:bottom-10",
        // "bottom-32",
        "w-full",
        "flex",
        "justify-center",
        "items-center",
        "relative",
        containerClassName
      )}
    >
      <a href="#">
        <div
          className={cn(
            // "w-[35px]",
            // "h-[64px]",
            // "absolute",
            // "xs:bottom-10",
            // "bottom-32",
            "rounded-3xl",
            "border-4",
            "border-secondary",
            "flex",
            "justify-center",
            "items-start",
            "p-2",
            className
          )}
        >
          <motion.div
            animate={{
              // y: [0, 24, 0],
              x: [0, 10, 5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="mb-1 rounded-full size-2 bg-secondary"
          />
        </div>
      </a>
    </div>
  );
}
