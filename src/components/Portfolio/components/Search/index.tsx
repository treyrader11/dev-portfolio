"use client";

import { cn } from "@/lib/utils";
import { FiSearch } from "react-icons/fi";
import { MdClear } from "react-icons/md";
import { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  className?: string;
  onChange: (text: string) => void;
  clearInput: () => void;
  onClick: () => void;
  isFocused: boolean;
}

const Search = forwardRef<HTMLInputElement, Props>(
  function Search({ className, onChange, clearInput, onClick, isFocused }, ref) {
    return (
      <motion.div
        animate={{
          width: isFocused ? "100%" : 24,
          borderBottomWidth: isFocused ? 0.3 : 0,
        }}
        transition={{
          width: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
          borderBottomWidth: { duration: 0.3, delay: isFocused ? 0.2 : 0 },
        }}
        className={cn(
          "h-fit",
          "items-center",
          "text-white",
          "gap-x-2",
          "inline-flex",
          "border-b-white/40",
          "md:max-w-1/2",
          "overflow-hidden",
          "flex-shrink-0",
          className
        )}
      >
        <form
          className={cn(
            "bg-transparent",
            "flex items-center",
            "text-2xl",
            "w-full",
            "relative"
          )}
          onSubmit={(e) => e.preventDefault()}
        >
          <FiSearch
            onClick={onClick}
            className={cn(
              "absolute",
              "flex-shrink-0",
              "text-2xl",
              "cursor-pointer",
              "hover:opacity-70",
              "transition-opacity",
              "duration-200"
            )}
          />
          <motion.input
            ref={ref}
            placeholder="Search by stack..."
            onChange={(e) => onChange(e.target.value)}
            type="text"
            autoComplete="off"
            initial={{ opacity: 0 }}
            animate={{ opacity: isFocused ? 1 : 0 }}
            transition={{ duration: 0.3, delay: isFocused ? 0.15 : 0 }}
            className={cn(
              "px-3",
              "ml-8",
              "sm:ml-10",
              "font-extralight",
              "placeholder:font-extralight",
              "placeholder:text-slate-300/60",
              "focus-visible:outline-none",
              "bg-transparent",
              "w-full"
            )}
          />
          <AnimatePresence>
            {isFocused && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                onClick={() => clearInput()}
                className={cn(
                  "text-neutral-400",
                  "cursor-pointer",
                  "hover:text-white",
                  "transition-colors",
                  "duration-200",
                  "ml-auto",
                  "flex-shrink-0",
                  "relative",
                  "z-[50]",
                  "text-2xl"
                )}
              >
                <MdClear />
              </motion.button>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    );
  }
);

export default Search;
