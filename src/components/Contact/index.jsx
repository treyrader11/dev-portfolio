"use client";

import { useRef } from "react";
import { useScroll, motion, useTransform } from "framer-motion";
import Rounded from "@/common/Rounded";
import Magnetic from "@/common/Magnetic";
import profilePicture from "/public/images/portraits/coffee-portrait-grey.png";
import ProfilePicture from "@/common/ProfilePicture";
import { cn, getLocalTime } from "@/lib/utils";
import StyledLink from "@/common/StyledLink";
import Brand from "@/common/Brand";
import { userData } from "@/lib/data";

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
        "relative",
        "font-light"
        // "text-[0.9em]"
      )}
    >
      <div
        className={cn(
          "pt-[200px]",
          "w-full",
          "bg-dark",
          "px-6",
          "sm:px-20",
          "lg:px-[10rem]"
        )}
      >
        <div className={cn("border-b-[.5px] border-light-300/70")}>
          <span className="flex items-center">
            <ProfilePicture className="size-[9vw]" src={profilePicture} />
            <h2 className="ml-[0.3em] tracking-tighter text-[9vw]">
              Let&apos;s work
            </h2>
          </span>
          <h2 className="text-[9vw] tracking-tighter font-light">together</h2>
          <motion.div
            style={{ x }}
            className={cn(
              "absolute",
              "left-[calc(100%_-_275px)]",
              "top-[calc(100%_-_714px)]"
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
        <div
          className={cn(
            "flex",
            "flex-col",
            "md:flex-row",
            "gap-5",
            "mt-[100px]",
            "items-center"
          )}
        >
          <Rounded
            className={cn("w-full md:w-fit py-5 px-10 border-[.3px]")}
            href="/contact"
          >
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
          <Rounded className={cn("w-full md:w-fit py-5 px-10 border-[.3px]")}>
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
      </div>
      <footer
        className={cn(
          "flex",
          "flex-col",
          "size-full",
          "md:flex-row",
          "md:flex-row-reverse",
          "md:items-center",
          "justify-between",
          "mt-[100px]",
          "p-6"
        )}
      >
        <Socials className={cn("py-5")} />
        <div className={cn("flex gap-2.5 py-5 w-full")}>
          <span
            className={cn(
              "flex",
              "items-end",
              "w-full",
              "text-[15px]",
              "justify-between",
              "md:justify-normal",
              "gap-3.5"
            )}
          >
            <StyledLink className="flex gap-1">
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
              })}
              <Brand />
            </StyledLink>
            <span className="flex flex-col gap-3">
              <h5 className="text-[10px] uppercase text-light-100">
                local time
              </h5>
              {getLocalTime()}
            </span>
          </span>
        </div>
      </footer>
    </motion.div>
  );
}

export function Socials({ className }) {
  const { socialLinks } = userData;
  return (
    <div
      className={cn(
        "border-b-[.5px]",
        "border-light-100/80",
        "md:border-none",
        "space-y-2",
        className
      )}
    >
      <h5 className="text-[10px] uppercase text-light-100">Socials</h5>
      <span className={cn("flex gap-3.5")}>
        <StyledLink target="_blank" href={socialLinks.github}>
          Github
        </StyledLink>
        <StyledLink target="_blank" href={socialLinks.youtube}>
          Youtube
        </StyledLink>
        <StyledLink target="_blank" href={socialLinks.instagram}>
          Instagram
        </StyledLink>
        <StyledLink target="_blank" href={socialLinks.linkedin}>
          Linkedin
        </StyledLink>
      </span>
    </div>
  );
}
