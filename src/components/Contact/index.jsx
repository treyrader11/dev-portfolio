"use client";

import { useRef } from "react";
import { useScroll, motion, useTransform } from "framer-motion";
import Rounded from "@/common/Rounded";
import Magnetic from "@/common/Magnetic";
import profilePicture from "/public/images/portraits/coffee-portrait-grey.png";
import ProfilePicture from "@/common/ProfilePicture";
import { cn } from "@/lib/utils";
import StyledLink from "@/common/StyledLink";
import Brand from "@/common/Brand";

export default function Contact() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y = useTransform(scrollYProgress, [0, 1], [-500, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [120, 90]);
  return (
    <motion.div
      style={{ y }}
      ref={container}
      className={cn(
        "text-white",
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "bg-dark",
        "relative"
      )}
    >
      {/* <div className={cn("pt-[200px] w-full bg-dark max-w-[1800px]")}> */}
      <div className={cn("pt-[200px] w-full bg-dark")}>
        <div
          className={cn(
            "border-b-[1px]",
            "border-light-300",
            "pb-[100px]",
            "mx-[200px]",
            "relative"
          )}
        >
          <span className="flex items-center">
            <ProfilePicture src={profilePicture} />
            <h2 className="ml-[0.3em]">Let&apos;s work</h2>
          </span>
          <h2 className="text-[5vw] m-0 font-light">together</h2>
          <motion.div
            style={{ x }}
            className={cn(
              "absolute",
              "left-[calc(100%_-_100px)]",
              "sm:left-[calc(100%_-_400px)]",
              "top-[calc(100%_-_75px)]"
            )}
          >
            <Rounded
              href="/contact"
              className={cn(
                "size-[140px]",
                "rounded-full",
                "bg-secondary",
                "p-0",
                "absolute"
              )}
            >
              <p
                className={cn(
                  "relative",
                  "z-[1]",
                  "transition-colors",
                  "duration-[400]",
                  "ease-linear"
                )}
              >
                Get in touch
              </p>
            </Rounded>
          </motion.div>
          <motion.svg
            style={{ rotate, scale: 2 }}
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 8.5C8.27614 8.5 8.5 8.27614 8.5 8L8.5 3.5C8.5 3.22386 8.27614 3 8 3C7.72386 3 7.5 3.22386 7.5 3.5V7.5H3.5C3.22386 7.5 3 7.72386 3 8C3 8.27614 3.22386 8.5 3.5 8.5L8 8.5ZM0.646447 1.35355L7.64645 8.35355L8.35355 7.64645L1.35355 0.646447L0.646447 1.35355Z"
              fill="white"
            />
          </motion.svg>
        </div>
        <div className={cn("flex", "gap-5", "mt-[100px]", "mx-[200px]")}>
          <Rounded href="/contact" className="w-20 py-6">
            <p
              className={cn(
                "relative",
                "z-[1]",
                "transition-colors",
                "duration-400",
                "ease-linear"
              )}
            >
              developertrey@gmail.com
            </p>
          </Rounded>
          <Rounded>
            <p
              className={cn(
                "relative",
                "z-[1]",
                "transition-colors",
                "duration-400",
                "ease-linear"
              )}
            >
              504.756.4538
            </p>
          </Rounded>
        </div>
        <div className={cn("flex justify-between mt-[200px] p-5")}>
          <div className="flex gap-2.5 items-end">
            <span className={cn("flex items-center gap-3.5")}>
              <StyledLink className="flex gap-1.5">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                })}
                <Brand />
              </StyledLink>
            </span>
          </div>
          <Socials />
        </div>
      </div>
    </motion.div>
  );
}

export function Socials({ className }) {
  return (
    <div className={className}>
      <span className={cn("flex flex-col gap-3.5")}>
        <StyledLink>Github</StyledLink>
      </span>
      <StyledLink>Youtube</StyledLink>
      <StyledLink>Instagram</StyledLink>
      <StyledLink>Linkedin</StyledLink>
    </div>
  );
}
