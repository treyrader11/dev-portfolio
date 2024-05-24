"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import PageTitle from "../PageTitle";
import { testimonials } from "@/lib/data";
import ProfilePicture from "../ProfilePicture";
import SwipeCarousel from "./components/Carousel";
import { motion } from "framer-motion";
import { SPRING_OPTIONS } from "./anim";

export default function Testimonials({ className }) {
  const [selected, setSelected] = useState(0);

  return (
    <div
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

      <SwipeCarousel
        className={cn("w-full", "absolute", "top-2/3", "-translate-y-1/2")}
      />
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
      {/* </div> */}
    </div>
  );
}

export function Testimonial({
  className,
  name,
  quote,
  image_url,
  isSelected,
  scale,
}) {
  return (
    <motion.div
      animate={{ scale }}
      transition={SPRING_OPTIONS}
      style={{
        //   backgroundImage: `url(${tes.image_url.src})`,
        // backgroundSize: "cover",
        // backgroundPosition: "center",
        height: 300,
        width: "100%",
      }}
      className={cn(
        // "bg-dark-400",
        "overflow-hidden",
        "text-center",
        "top-0",
        "left-0",
        "pb-[70px]",
        "px-0",
   
        "flex",
        "flex-col",
        "gap-4",
        "w-full",
        
        "opacity-0",
        "absolute",
        isSelected ? "opacity-100 relative" : "opacity-0",
        className
      )}
    >
      <ProfilePicture
        src={image_url.src}
        className={cn("img", "size-[100px]", "mx-auto")}
      />
      <h2 className="text-xl font-semibold text-secondary">{name}</h2>
      <p className={cn("text-sm", "", "w-full", "mx-auto")}>{quote}</p>
    </motion.div>
  );
}
