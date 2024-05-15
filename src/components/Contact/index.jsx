"use client";

import { useRef } from "react";
import { useScroll, motion, useTransform } from "framer-motion";
import Rounded from "@/common/Rounded";
import Magnetic from "@/common/Magnetic";
import Container from "@/common/Container";
import profilePicture from "/public/images/portraits/coffee-portrait-grey.png";
import ProfilePicture from "@/common/ProfilePicture";
import { cn } from "@/lib/utils";

const styles = {
  contact: cn(
    "text-white",
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "bg-dark",
    "relative"
  ),
  container: cn("pt-[200px]", "w-full", "bg-dark", "max-w-[1800px]"),
  title: cn(
    "border-b-[1px]",
    "border-light-300",
    "pb-[100px]",
    "mx-[200px]",
    "relative"
  ),
  buttonContainer: cn(
    "absolute",
    "left-[calc(100%_-_400px)]",
    "top-[calc(100%_-_75px)]"
  ),
  button: cn(
    "w-[180px]",
    "h-[180px]",
    "bg-primary-500",
    "text-white",
    "rounded-full",
    "absolute",
    "flex",
    "items-center",
    "justify-center",
    "cursor-pointer"
  ),
  p: cn("m-0", "text-[16px]", "font-light", "z-[2]", "relative"),
  svg: cn("absolute", "top-[30%]", "left-full"),
  nav: cn("flex", "gap-5", "mt-[100px]", "mx-[200px]"),
  info: cn("flex", "justify-between", "mt-[200px]", "p-5"),
  infoText: cn(
    "m-0",
    "p-[2.5px]",
    "cursor-pointer",
    "after:w-0",
    "after:h-[1px]",
    "after:bg-white",
    "after:block",
    "after:mt-[2px]",
    "after:relative",
    "after:left-[50%]",
    "after:transform",
    "-after:translate-x-[50%]",
    "after:transition-width",
    "after:duration-200",
    "after:ease-linear",
    "hover:after:w-full"
  ),
  infoheading: cn("m-0", "p-[2.5px]", "cursor-pointer"),
  span: cn("flex", "flex-col", "gap-[15px]"),
};

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
      <div className={cn("pt-[200px]", "w-full", "bg-dark", "max-w-[1800px]")}>
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
              "left-[calc(100%_-_400px)]",
              "top-[calc(100%_-_75px)]"
            )}
          >
            <Rounded
              className={cn(
                "size-[180px]",
                "rounded-full",
                "bg-secondary",
                "p-0",
                "z-[9999]",
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
          <Rounded className="w-20 py-6">
            <p>info@treyrader.com</p>
          </Rounded>
          <Rounded>
            <p>504.756.4538</p>
          </Rounded>
        </div>
        <div className={cn("flex", "justify-between", "mt-[200px]", "p-5")}>
          <div className="flex gap-[10px] items-end">
            <span className={cn("flex", "flex-col", "gap-[15px]")}>
              <h3 className={styles.infoHeading}>Placeholder</h3>
              <p className={styles.infoText}>2023 © Edition</p>
            </span>
            <span className={cn("flex", "flex-col", "gap-[15px]")}>
              <h3 className={styles.infoHeading}>Placeholder</h3>
              <p className={styles.infoText}>placeholder</p>
            </span>
          </div>
          <div>
            <span className={cn("flex", "flex-col", "gap-[15px]")}>
              <h3 className={styles.infoHeading}>socials</h3>
              <Magnetic>
                <p className={styles.infoText}>Github</p>
              </Magnetic>
            </span>
            <Magnetic>
              <p className={styles.infoText}>Youtube</p>
            </Magnetic>
            <Magnetic>
              <p className={styles.infoText}>Instagram</p>
            </Magnetic>
            <Magnetic>
              <p className={styles.infoText}>Linkedin</p>
            </Magnetic>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
