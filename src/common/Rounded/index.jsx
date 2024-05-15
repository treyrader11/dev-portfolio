"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Magnetic from "../Magnetic";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

export default function Rounded({
  children,
  className,
  backgroundColor = "#455CE9",
  href,
  ...attributes
}) {
  const circle = useRef(null);
  let timeline = useRef(null);
  let timeoutId = null;

  const router = useRouter();

  useEffect(() => {
    timeline.current = gsap.timeline({ paused: true });
    timeline.current
      .to(
        circle.current,
        { top: "-25%", width: "150%", duration: 0.4, ease: "power3.in" },
        "enter"
      )
      .to(
        circle.current,
        { top: "-150%", width: "125%", duration: 0.25 },
        "exit"
      );
  }, []);

  const manageMouseEnter = () => {
    console.log("timeoutId", timeoutId);
    if (timeoutId) clearTimeout(timeoutId);
    timeline.current.tweenFromTo("enter", "exit");
  };

  const manageMouseLeave = () => {
    timeoutId = setTimeout(() => {
      timeline.current.play();
    }, 300);
  };

  return (
    <Magnetic>
      <div
        onClick={() => router.push(href)}
        className={cn(
          "rounded-full",
          "border-light-100",
          "border",
          // "border-[1px]",
          "cursor-pointer",
          "relative",
          "flex",
          "items-center",
          "justify-center",
          "py-[15px]",
          "px-[60px]",
          "text-white",
          className
        )}
        style={{ overflow: "hidden" }}
        onMouseEnter={() => {
          manageMouseEnter();
        }}
        onMouseLeave={() => {
          manageMouseLeave();
        }}
        {...attributes}
      >
        {children}
        <div
          ref={circle}
          style={{ backgroundColor }}
          className={cn(
            "w-full",
            "h-[150%]",
            "absolute",
            // "rounded-1/2",
            "rounded-[50%]",
            "top-full",
            "z-[12]",
            // "z-[99]",
            "bg-primary"
          )}
        />
      </div>
    </Magnetic>
  );
}
