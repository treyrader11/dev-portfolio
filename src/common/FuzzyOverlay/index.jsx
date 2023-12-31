"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./styles";
import noiseBG from "/public/noise.png";
import blackNoiseBG from "/public/black-noise.png";
import { cn } from "@/lib/utils";

export const FuzzyOverlayExample = () => {
  return (
    // NOTE: An overflow of hidden will be required on a wrapping
    // element to see expected results
    <div className="relative overflow-hidden">
      <ExampleContent />
      <FuzzyOverlay />
      <img src={noiseBG} />
    </div>
  );
};

export default function FuzzyOverlay() {
  return (
    <motion.div
      initial={{ transform: "translateX(-10%) translateY(-10%)" }}
      animate={{
        transform: "translateX(10%) translateY(10%)",
      }}
      transition={{
        repeat: Infinity,
        duration: 0.2,
        ease: "linear",
        repeatType: "mirror",
      }}
      style={{
        backgroundImage: `url(${noiseBG})`,
        // backgroundImage: 'url("/public/noise.png")',
      }}
      className={cn(styles.backgroundImage)}
    />
  );
}

export const ExampleContent = () => {
  return (
    <div className="relative grid h-screen p-8 space-y-6 place-content-center bg-neutral-950">
      <p className="text-6xl font-black text-center text-neutral-50">
        Fuzzy Overlay Example
      </p>
      <p className="text-center text-neutral-400">
        This is a basic example of using a lo-fi fuzzy overlay 📺
      </p>
      <div className="flex items-center justify-center gap-3">
        <button className="px-4 py-2 font-semibold transition-colors text-neutral-20 w-fit text-neutral-200 hover:bg-neutral-800">
          Pricing
        </button>
        <button className="px-4 py-2 font-semibold transition-colors w-fit bg-neutral-200 text-neutral-700 hover:bg-neutral-50">
          Try it free
        </button>
      </div>
    </div>
  );
};
