"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import type { ReactNode, CSSProperties } from "react";

interface Props {
  className?: string;
  children?: ReactNode;
  once?: boolean;
  style?: CSSProperties;
}

const BlurredIn = forwardRef<HTMLDivElement, Props>(
  function BlurredIn({ className, children, once = false, style }, ref) {
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
        style={style}
        className={cn(className)}
      >
        {children}
      </motion.div>
    );
  }
);

export default BlurredIn;
