"use client";

import { useEffect, useRef, forwardRef, useCallback } from "react";
import type { ReactNode, HTMLAttributes } from "react";
import gsap from "gsap";
import Magnetic from "../Magnetic";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  text?: string;
  backgroundColor?: string;
  href?: string;
}

const Rounded = forwardRef<HTMLDivElement, Props>(
  function Rounded(
    {
      children,
      className,
      text,
      backgroundColor = "#292929",
      href,
      ...attributes
    },
    ref
  ) {
    const circle = useRef<HTMLDivElement>(null);
    const timeline = useRef<gsap.core.Timeline | null>(null);
    const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

    const router = useRouter();

    const handleClick = useCallback(
      () => href && router.push(`${href}`),
      [href, router]
    );

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

    const manageMouseEnter = useCallback(() => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
      timeline.current?.tweenFromTo("enter", "exit");
    }, []);

    const manageMouseLeave = useCallback(() => {
      timeoutId.current = setTimeout(() => {
        timeline.current?.play();
      }, 300);
    }, []);

    return (
      <Magnetic>
        <div
          ref={ref}
          onClick={handleClick}
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
            "py-3.5",
            "px-14",
            "text-white",
            "shadow-lg",
            className
          )}
          style={{ overflow: "hidden" }}
          onMouseEnter={manageMouseEnter}
          onMouseLeave={manageMouseLeave}
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
                "inline-flex",
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
);

export default Rounded;
