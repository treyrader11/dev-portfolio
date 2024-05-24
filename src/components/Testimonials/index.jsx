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
        items={testimonials}
        className={cn("w-full", "absolute", "top-2/3", "-translate-y-1/2")}
      />
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
      className={cn(
        "overflow-hidden",
        "text-center",
        "top-0",
        "left-0",
        // "inset-x-0",
        "pb-[70px]",
        "px-0",
        "flex",
        "flex-col",
        "gap-4",
        "w-full",
        "h-[300px]",
        "border border-red-600",

        // "absolute",
        isSelected ? "opacity-100 relative" : "opacity-0",
        className
      )}
    >
      <ProfilePicture
        src={image_url.src}
        className={cn("size-[200px]", "mx-auto")}
      />
      <h2 className="text-xl font-semibold text-secondary">{name}</h2>
      <p className={cn("text-sm", "", "w-full", "mx-auto")}>{quote}</p>
    </motion.div>
  );
}
