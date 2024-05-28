"use client";

import { cn } from "@/lib/utils";
import { useState, forwardRef } from "react";
import { motion } from "framer-motion";

function CardFlip({ className, children }, ref) {
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
        className={cn("flip-card rounded-md")}
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
            //   backgroundImage: `url(${imageSrc})`,
              backgroundPosition: "center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
            className={cn("bg-cover flip-card-front size-full", className)}
          >
            {children}
          </div>
          {/* <div className="bg-cover flip-card-back size-full">back</div> */}
        </motion.div>
      </div>
    </div>
  );
}

export default forwardRef(CardFlip);
