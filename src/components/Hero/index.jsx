"use client";

import { useState, useRef } from "react";
import { useInView, motion } from "framer-motion";
import useMousePosition from "@/hooks/useMousePosition";
import { cn } from "@/lib/utils";
import { slideUp } from "./anim";
import Image from "next/image";
import Rounded from "@/components/Rounded";
import { userData } from "@/lib/data";

const phrase =
  "I'm a selectively skilled web developer focusing on delivering quality & impactful digital experiences.";

const targetedWords = phrase
  .split(" ")
  .filter((word) => word.includes("selectively") || word.includes("skilled"));

export default function Hero({ isLoading }) {
  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 400 : 40;
  const hero = useRef(null);
  const isInView = useInView(hero);

  return (
    <section
      ref={hero}
      className={cn("h-screen", "bg-dark", "custom-font", "relative", "flex")}
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
          "mask"
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
        <p className={cn("w-[1000px]", "p-[40px]", "mt-[20%]")}>
          {phrase.split(" ").map((word, index) => {
            const isTargetedWord = targetedWords.includes(word.toLowerCase());

            return (
              <motion.span
                variants={slideUp}
                custom={index}
                animate={!isLoading ? (isInView ? "open" : "closed") : ""}
                key={index}
                className={cn("mr-3 inline-flex text-light-400", {
                  "text-purple-400": isTargetedWord,
                })}
              >
                {word}
              </motion.span>
            );
          })}
        </p>

        <div
          className={cn(
            "w-1/2",
            "h-full",
            "hidden",
            "1140:flex",
            "flex-row",
            "items-center",
            "select-none",
            "justify-between "
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
      <div data-scroll data-scroll-speed={0.1}>
        <div
          className={cn(
            "z-[9999]",
            "absolute",
            "right-[10%]",
            "top-[70%]",
            "left-[calc(100%_-_275px)]"
          )}
        >
          <Rounded
            href={userData.resumeUrl}
            text="Download CV"
            target="__blank"
            // className={cn(
            //   "top-[80%]",
            //   // "md:left-[clac(100%_-_400px)]",
            //   "left-0",
            //   "size-[140px]",
            //   "bg-dark-400"
            // )}
            className={cn("w-full py-5 px-12 border-[.3px]")}
          />
        </div>
      </div>
    </section>
  );
}
