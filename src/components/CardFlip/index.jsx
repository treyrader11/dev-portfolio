"use client";

import { cn } from "@/lib/utils";
import { useState, forwardRef } from "react";
import { motion } from "framer-motion";
import jason from "/public/images/testimonials/jason-humphrey.png";
import vite from "/public/images/tech/vite.png";

function CardFlip({ className }, ref) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        ref={ref}
        onClick={handleFlip}
        className={cn("flip rounded-md")}
      >
        <motion.div
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 360 }}
          transition={{ duration: 0.6, animationDirection: "normal" }}
          onAnimationComplete={() => setIsAnimating(false)}
          className="flip-card-inner size-full"
        >
          {/* Card content */}

          <div
            style={{
              backgroundImage: `url(${jason.src})`,
              backgroundPosition: "center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
            className={cn("bg-cover flip-card-front size-full", className)}
          >
            
          </div>
          <div
            style={{
              backgroundImage: `url(${vite.src})`,
              backgroundPosition: "center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
            className={cn("bg-cover flip-card-back size-full", className)}
          >
            
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default forwardRef(CardFlip);
