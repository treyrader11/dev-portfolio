"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { text, curve, translate } from "./anim";
import { cn } from "@/lib/utils";
import { routes } from "@/components/Header/nav/routes";
import { variants } from "@/lib/motion";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  backgroundColor?: string;
  className?: string;
}

interface Dimensions {
  width: number | null;
  height: number | null;
}

export default function Curve({
  children,
  backgroundColor = "white",
  className,
}: Props) {
  const router = useRouter();
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: null,
    height: null,
  });

  useEffect(() => {
    function resize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      className={cn("p-10 min-h-screen", className)}
      style={{ backgroundColor }}
    >
      {/* Background */}
      <div
        style={{ opacity: dimensions.width == null ? 1 : 0 }}
        className={cn(
          "fixed",
          "left-0",
          "top-0",
          "z-[999]",
          "w-screen",
          "h-[calc(100vh_+_600px)]",
          "pointer-events-none",
          "bg-white",
          "transition-opacity",
          // "duration-none",
          "duration-0",
          "ease-linear",
          "delay-100"
        )}
      />
      <motion.p
        className={cn(
          "absolute",
          "left-1/2",
          "top-[40%]",
          "text-white",
          "text-5xl",
          "z-[99]",
          "text-center",
          "transform",
          "-translate-x-1/2"
        )}
        {...variants(text)}
      >
        {routes.find((r) => r.href === router.route)?.label}
      </motion.p>
      {dimensions.width != null && <SVG width={dimensions.width} height={dimensions.height} />}
      {children}
    </div>
  );
}

interface SVGProps {
  height: number | null;
  width: number | null;
}

function SVG({ height, width }: SVGProps) {
  if (width == null || height == null) {
    return null;
  }
  const initialPath = `
        M0 300
        Q${width / 2} 0 ${width} 300
        L${width} ${height + 300}
        Q${width / 2} ${height + 600} 0 ${height + 300}
        L0 0
    `;

  const targetPath = `
    M0 300
    Q${width / 2} 0 ${width} 300
    L${width} ${height}
    Q${width / 2} ${height} 0 ${height}
    L0 0
`;

  return (
    <motion.svg
      {...variants(translate)}
      className={cn(
        "fixed",
        "left-0",
        "top-0",
        "z-[999]",
        "w-screen",
        "h-[calc(100vh_+_600px)]",
        "pointer-events-none",
        "bg-dark-600",
        "transition-opacity",
        // "duration-none",
        "duration-0",
        "ease-linear",
        "delay-100"
      )}
    >
      <motion.path {...variants(curve(initialPath, targetPath))} />
    </motion.svg>
  );
}
