"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePopoverStore } from "./popover-store";

interface PopoverProps {
  // The clickable trigger. Receives the open state and a toggle callback.
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
  // Panel content. If a function, it receives a `close` callback.
  children: ReactNode | ((close: () => void) => ReactNode);
  align?: "start" | "end";
  // Extra classes for the panel.
  className?: string;
  // Classes for the root wrapper (defaults to inline-block; override for width).
  rootClassName?: string;
}

// Reusable, animated popover. Open state lives in a shared zustand store so only
// one popover is open at a time. Closes on outside click or Escape.
export function Popover({
  trigger,
  children,
  align = "start",
  className,
  rootClassName,
}: PopoverProps) {
  const id = useId();
  const openId = usePopoverStore((s) => s.openId);
  const toggle = usePopoverStore((s) => s.toggle);
  const close = usePopoverStore((s) => s.close);
  const open = openId === id;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <div ref={ref} className={cn("relative", rootClassName ?? "inline-block")}>
      {trigger({ open, toggle: () => toggle(id) })}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className={cn(
              "absolute z-50 mt-2 min-w-[14rem] overflow-hidden rounded-lg border border-dark-600 bg-dark-500 p-1 shadow-2xl",
              align === "end" ? "right-0" : "left-0",
              className,
            )}
          >
            {typeof children === "function" ? children(close) : children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
