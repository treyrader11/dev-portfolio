"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Magnetic from "../Magnetic";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

export default function Rounded({
  children,
  className,
  text,
  backgroundColor = "#8550C2",
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
          "group",
          "rounded-full",
          "border-light-100",
          "border",
          "cursor-pointer",
          "relative",
          "flex",
          "items-center",
          "justify-center",
          "py-[15px]",
          "px-[60px]",
          "text-white",
          "shadow-lg",
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
        {text ? (
          <div
            className={cn(
              "relative",
              "z-[1]",
              "transition-colors",
              "duration-[400]",
              "ease-linear",
              "flex",
              "group-hover:text-white"
            )}
          >
            {text}
          </div>
        ) : (
          children
        )}

        <div
          ref={circle}
          style={{ backgroundColor }}
          className={cn(
            "w-full",
            "h-[150%]",
            "absolute",
            "rounded-[50%]",
            "top-full",
            "bg-primary"
          )}
        />
      </div>
    </Magnetic>
  );
}
