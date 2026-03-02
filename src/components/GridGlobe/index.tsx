"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { colors, globeConfig, sampleArcs } from "./config";
import { cn } from "@/lib/utils";

const World = dynamic(() => import("./components/Globe").then((m) => m.World), {
  ssr: false,
});

interface Props {
  className?: string;
}

export default function GridGlobe({ className }: Props) {
  return (
    <div
      className={cn(
        "absolute",
        "flex",
        "items-center",
        "justify-center",
        "size-full",
        "-left-5",
        "top-36",
        "md:top-40",
        className
      )}
    >
      <div
        className={cn(
          "relative",
          "w-full",
          "px-4",
          "mx-auto",
          "overflow-hidden",
          "max-w-7xl",
          "h-96"
        )}
      >
        <div
          className={cn(
            "absolute",
            "inset-x-0",
            "bottom-0",
            "z-40",
            "w-full",
            "h-40",
            "pointer-events-none",
            "select-none",
            "bg-gradient-to-b",
            "from-transparent",
            "dark:to-black",
            "to-white"
          )}
        />
        {/* remove -bottom-20 */}
        <div className="absolute z-10 w-full h-72 md:h-full">
          <World data={sampleArcs} globeConfig={globeConfig} />
        </div>
      </div>
    </div>
  );
}
