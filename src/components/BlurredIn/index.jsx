"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function BlurredIn({ className, children, once = false }) {
  return (
    <motion.div
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
