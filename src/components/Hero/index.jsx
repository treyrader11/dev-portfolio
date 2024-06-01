"use client";

import { useState, useRef } from "react";
import { useInView, motion, useTransform } from "framer-motion";
import useMousePosition from "@/hooks/useMousePosition";
import { cn } from "@/lib/utils";
import { slideUp } from "./anim";
import Image from "next/image";
import BlurredIn from "../BlurredIn";

const phrase =
  "I'm a selectively skilled web developer focusing on delivering quality & impactful digital experiences.";

const targetedWords = phrase
  .split(" ")
  .filter((word) => word.includes("selectively") || word.includes("skilled"));

export default function Hero({ isLoading, scrollYProgress, className }) {
  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 400 : 40;
  const hero = useRef(null);
  const isInView = useInView(hero);

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);

  return (
    <motion.section
      ref={hero}
      style={{ scale, rotate }}
      className={cn(
        "h-screen",
        "bg-dark",
        // "custom-font",
        "relative",
        "flex",
        className
      )}
    >
      {/* cursor mask */}
      <motion.div
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
      </motion.div>

      <div
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
        <BlurredIn className={cn("w-[1000px] p-10 mt-[20%]")}>
          {phrase.split(" ").map((word, index) => {
            const isTargetedWord = targetedWords.includes(word.toLowerCase());

            return (
              <motion.span
                variants={slideUp}
                custom={index}
                animate={!isLoading ? (isInView ? "open" : "closed") : ""}
                key={index}
                className={cn("mr-3 inline-flex text-light-400", {
                  "text-purple-400 font-pp-acma": isTargetedWord,
                })}
              >
                {word}
              </motion.span>
            );
          })}
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
      {/* <JumpingIcon /> */}
    </motion.section>
  );
}

const Card = ({ className, children }) => {
  return (
    <motion.div
      initial={{
        filter: "blur(4px)",
      }}
      whileInView={{
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
        delay: 0.25,
      }}
      className={cn(
        "relative",
        "size-full",
        "overflow-hidden",
        "rounded-2xl",
        "border",
        "border-slate-800",
        "bg-gradient-to-br",
        "from-slate-950/50",
        "to-slate-900/80",
        "p-6",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

function JumpingIcon({ className }) {
  return (
    <div
      className={cn(
        "absolute",
        "xs:bottom-10",
        "bottom-32",
        "w-full",
        "flex",
        "justify-center",
        "items-center",
        className
      )}
    >
      <a href="#">
        <div
          className={cn(
            "w-[35px]",
            "h-[64px]",
            "rounded-3xl",
            "border-4",
            "border-secondary",
            "flex",
            "justify-center",
            "items-start",
            "p-2"
          )}
        >
          <motion.div
            animate={{
              y: [0, 24, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="mb-1 rounded-full size-3 bg-secondary"
          />
        </div>
      </a>
    </div>
  );
}
