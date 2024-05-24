"use client";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import PageTitle from "../PageTitle";
import { testimonials } from "@/lib/data";
import ProfilePicture from "../ProfilePicture";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import SwipeCarousel from "./components/Carousel";

export default function Testimonials({ className }) {
  const [selected, setSelected] = useState(0);

  const container = useRef();
  const dots = useRef();
  const content = useRef();

  return (
    <div
      ref={container}
      className={cn(
        "w-full",
        "bg-white",
        "mx-auto",
        "relative",
        // "py-[20vh]",
        className
      )}
    >
      <PageTitle
        containerClass="h-0"
        className="text-[10vw]"
        backgroundColor="transparent"
        title="Testimonials."
      />
      <div
        className={cn(
          // "textim",
          "w-full",
          "absolute",
          "top-2/3",
          "-translate-y-1/2",
          "overflow-auto"
        )}
      >
        <SwipeCarousel />
        {/* <div
          className={cn(
            // "wrap",
            "mx-6",
            "relative",
            "w-full",
            "max-w-[1024px]",
            "py-10",
            "px-5"
          )}
        >
          <FaChevronRight
            className={cn(
              // "arrow",
              "text-white",
              "absolute",
              "text-3xl",
              "cursor-pointer",
              "top-1/2",
              "-translate-y-1/2",
              "transition-all",
              "duration-300",
              "ease-in-out",
              "p-[5px]",
              "z-[10]",
              "right-2.5",
              "hover:text-purple-600",

              "before:cursor-pointer"
            )}
          />

          <FaChevronLeft
            className={cn(
              // "arrow",
              "text-white",
              "absolute",
              "text-3xl",
              "cursor-pointer",
              "top-1/2",
              "-translate-y-1/2",
              "transition-all",
              "duration-300",
              "ease-in-out",
              "p-[5px]",
              "z-[10]",
              "left-2.5",
              "hover:text-purple-600",

              "before:cursor-pointer"
            )}
          />
          <ul
            ref={dots}
            className={cn(
              // "dots",
              "inline-block",
              "size-3",
              "rounded-full",
              "border",
              "border-px",
              //   "border-white",
              "my-0",
              "mx-2.5",
              "cursor-pointer",
              "transition-all",
              "duration-500",
              "ease-in-out",
              "relative"
            )}
          >
            {testimonials.map((index) => (
              <li
                key={`dot_${index}`}
                className={cn(
                  // "dot",
                  "text-center",
                  "absolute",
                  "w-full",
                  "bottom-[60px]",
                  "left-0",
                  "z-[10]",
                  "size-3",
                  "hover:bg-purple-500",
                  "hover:border-purple-500",
                  selected == index ? "scale-50 ease-in-out" : ""
                )}
              />
            ))}
          </ul>

          <div
            ref={content}
            className={cn(
              // "cont",
              "relative",
              "overflow-hidden"
            )}
          >
            {testimonials.map((testimonial, index) => (
              <Testimonial
                key={index}
                {...testimonial}
                isSelected={selected == index}
              />
            ))}
          </div>
        </div>  */}
      </div>
    </div>
  );
}

export function Testimonial({ className, name, quote, image_url, isSelected }) {
  return (
    <div
      className={cn(
        //   "active",
        "bg-dark-400",
        "absolute",
        "text-center",
        "top-0",
        "left-0",
        "pb-[70px]",
        "px-0",
        "opacity-0",
        "flex",
        "flex-col",
        "gap-4",
        isSelected ? "opacity-100 relative" : "opacity-100",
        className
      )}
    >
      <ProfilePicture
        src={image_url.src}
        className={cn("img", "size-[100px]", "mx-auto")}
      />
      <h2 className="text-xl font-semibold text-secondary">{name}</h2>
      <p className={cn("text-sm", "text-slate-100", "w-4/5", "mx-auto")}>
        {quote}
      </p>
    </div>
  );
}
