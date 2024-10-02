"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { slideUp } from "./anim";
import Image from "next/image";
import BlurredIn from "../BlurredIn";

const phrase =
  "Experienced product engineer focusing on delivering quality & impactful digital experiences.";

const targetedWords = phrase
  .split(" ")
  .filter((word) => word.includes("product") || word.includes("engineer"));

export default function Hero({ className }) {
  const hero = useRef(null);

  return (
    <motion.section
      ref={hero}
      className={cn(
        "h-screen",
        "bg-transparent",
        // "custom-font",
        "relative",
        "flex",
        className
      )}
    >
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
        <BlurredIn
          className={cn(
            "w-[1000px]",
            "p-10",
            "mt-[20%]",
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
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  key={i}
                  className={cn("mr-3 inline-flex  text-light-400", {
                    "text-purple-400 text-5xl md:text-8xl font-pp-acma": isTargetedWord,
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
              );
            })}
          </div>
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
