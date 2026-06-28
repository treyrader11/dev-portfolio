"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  className?: string;
  showClose?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  className,
  showClose = true,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className={cn(
            "fixed",
            "inset-0",
            "z-[60]",
            "flex",
            "items-center",
            "justify-center",
            "bg-black/50",
            "backdrop-blur-sm",
            "p-4"
          )}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            className={cn(
              "relative",
              "w-full",
              "max-w-md",
              "rounded-xl",
              "bg-white",
              "dark:bg-dark-500",
              "text-dark",
              "dark:text-white",
              "shadow-xl",
              className
            )}
          >
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className={cn(
                  "absolute",
                  "right-4",
                  "top-4",
                  "text-gray-400",
                  "transition-colors",
                  "hover:text-gray-600",
                  "dark:hover:text-gray-200"
                )}
              >
                <IoClose size={22} />
              </button>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
