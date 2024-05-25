"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

function BlurredIn({ className, children, once = false }, ref) {
  return (
    <motion.div
      ref={ref}
      initial={{
        filter: "blur(4px)",
      }}
      whileInView={{
        filter: "blur(0px)",
      }}
      viewport={{ once }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
        delay: 0.25,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export default forwardRef(BlurredIn);
