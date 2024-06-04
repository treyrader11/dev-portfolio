"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { scaleAnimation } from "../../anim";
import { useRef, useEffect, forwardRef } from "react";
import gsap from "gsap";

function Modal(
  { className, style, isActive, children, onClick, showWhileHovering = false },
  ref
) {
  const modal = useRef(null);
  const cursor = useRef(null);
  const cursorLabel = useRef(null);

  let xMoveContainer = useRef(null);
  let yMoveContainer = useRef(null);
  let xMoveCursor = useRef(null);
  let yMoveCursor = useRef(null);
  let xMoveCursorLabel = useRef(null);
  let yMoveCursorLabel = useRef(null);

  useEffect(() => {
    // //Move Container
    xMoveContainer.current = gsap.quickTo(modal.current, "left", {
      duration: 0.8,
      ease: "power3",
    });
    yMoveContainer.current = gsap.quickTo(modal.current, "top", {
      duration: 0.8,
      ease: "power3",
    });
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
      ref={modal}
      style={style}
      className={cn(
        "h-[20vh]",
        "md:h-[30vh]",
        "w-[50vw]",
        "md:w-[60vw]",
        "fixed",
        "z-[10]",
        "top-0",
        "rounded-xl",
        "overflow-hidden",
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
        // "inset-x-0",
        // "z-[10]",
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

forwardRef(Cursor);
forwardRef(CursorLabel);
export default forwardRef(Modal);
