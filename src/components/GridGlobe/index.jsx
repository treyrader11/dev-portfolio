"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { colors, globeConfig, sampleArcs } from "./config";
import { cn } from "@/lib/utils";

const World = dynamic(() => import("./components/Globe").then((m) => m.World), {
  ssr: false,
});

export default function GridGlobe({ className }) {
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
        {/* <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="div"
        >
          <h2 className="text-xl font-bold text-center text-black md:text-4xl dark:text-white">
            We sell soap worldwide
          </h2>
          <p className="max-w-md mx-auto mt-2 text-base font-normal text-center md:text-lg text-neutral-700 dark:text-neutral-200">
            This globe is interactive and customizable. Have fun with it, and
            don&apos;t forget to share it.
          </p>
        </motion.div> */}
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
