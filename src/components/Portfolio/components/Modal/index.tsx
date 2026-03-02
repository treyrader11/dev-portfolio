"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { scaleAnimation } from "../../anim";
import { useRef, useEffect, forwardRef } from "react";
import gsap from "gsap";
import type { ReactNode, CSSProperties } from "react";

interface ModalProps {
  className?: string;
  style?: CSSProperties | Record<string, unknown>;
  isActive: boolean;
  children?: ReactNode;
  onClick?: () => void;
  imageUrl?: string;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  function Modal({ className, style, isActive, children, onClick }, ref) {
    const cursor = useRef<HTMLDivElement>(null);
    const cursorLabel = useRef<HTMLDivElement>(null);

    const xMoveCursor = useRef<gsap.QuickToFunc | null>(null);
    const yMoveCursor = useRef<gsap.QuickToFunc | null>(null);
    const xMoveCursorLabel = useRef<gsap.QuickToFunc | null>(null);
    const yMoveCursorLabel = useRef<gsap.QuickToFunc | null>(null);

    useEffect(() => {
      //Move cursor
      xMoveCursor.current = gsap.quickTo(cursor.current, "left", {
        duration: 0.5,
        ease: "power3",
      });
      yMoveCursor.current = gsap.quickTo(cursor.current, "top", {
        duration: 0.5,
        ease: "power3",
      });
      //Move cursor label
      xMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "left", {
        duration: 0.45,
        ease: "power3",
      });
      yMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "top", {
        duration: 0.45,
        ease: "power3",
      });
    }, []);

    return (
      <motion.div
        ref={ref}
        style={style}
        className={cn(
          "h-[20vh]",
          "md:h-[30vh]",
          "w-[50vw]",
          "md:w-[60vw]",

          "z-[10]",
          "top-0",
          "rounded-xl",
          "overflow-hidden",

          "fixed",
          className
        )}
      >
        <div
          className={cn(
            "relative",
            "size-full",
            "flex",
            "flex-col",
            "items-center",
            "justify-center"
          )}
        >
          <Cursor isActive={isActive} ref={cursor} />
          <CursorLabel isActive={isActive} ref={cursorLabel} onClick={onClick} />
          {children}
        </div>
      </motion.div>
    );
  }
);

interface CursorProps {
  className?: string;
  isActive: boolean;
}

const Cursor = forwardRef<HTMLDivElement, CursorProps>(
  function Cursor({ className, isActive }, ref) {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "size-20",
          "rounded-full",
          "bg-purple-500",
          "text-white",
          "fixed",
          "flex",
          "items-center",
          "justify-center",
          "text-sm",
          "font-light",
          "pointer-events-none",
          className
        )}
        variants={scaleAnimation}
        initial="initial"
        animate={isActive ? "enter" : "closed"}
      />
    );
  }
);

interface CursorLabelProps {
  className?: string;
  onClick?: () => void;
  isActive: boolean;
}

const CursorLabel = forwardRef<HTMLDivElement, CursorLabelProps>(
  function CursorLabel({ className, onClick, isActive }, ref) {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "size-20",
          "rounded-full",
          "bg-transparent",
          "text-white",
          "fixed",
          "z-[10]",
          "flex",
          "items-center",
          "justify-center",
          "text-sm",
          "font-light",
          "pointer-events-none",
          className
        )}
        variants={scaleAnimation}
        initial="initial"
        animate={isActive ? "enter" : "closed"}
        onClick={onClick}
      >
        View
      </motion.div>
    );
  }
);

export default Modal;
