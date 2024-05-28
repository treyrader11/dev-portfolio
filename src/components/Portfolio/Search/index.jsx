"use client";

import { cn } from "@/lib/utils";
import { FiSearch } from "react-icons/fi";
import { MdClear } from "react-icons/md";
import { forwardRef } from "react";

function Search({ className, onChange, clearInput, onClick, isFocused }, ref) {
  return (
    <div
      className={cn(
        "h-fit",
        "items-center",
        "text-white",
        "gap-x-2",
        "inline-flex",
        "duration-700",
        "transition-[border,width]",
        "ease-in-out",
        "w-6",
        isFocused
          ? cn("w-full", "md:max-w-1/2 border-b-[.3px]")
          : "border-none",
        className
      )}
    >
      <form
        className={cn(
          "bg-transparent",
          "border-slate-200",
          "flex items-center",
          "overflow-hidden",
          "text-2xl",
          "w-full",
          "ml-0",
          "relative"
        )}
      >
        <FiSearch
          onClick={onClick}
          className={cn(
            // "fixed",
            "absolute",
            "flex",
            "flex-shrink-0",
            "text-2xl",
            "cursor-pointer",
            // "left-6",
            // "pr-8",
          )}
        />
        <input
          ref={ref}
          placeholder="Search by stack..."
          onChange={(e) => onChange(e.target.value)}
          type="text"
          autoComplete="off"
          className={cn(
            "px-3",
            "ml-7",
            "sm:ml-12",
            "font-extralight",
            "placeholder:font-extralight",
            "placeholder:text-slate-200",
            "focus-visible:outline-none",
            "bg-transparent"
          )}
        />
        {isFocused && (
          <MdClear
            onClick={() => clearInput()}
            className={cn(
              "text-neutral-400",
              "cursor-pointer",
              "hover:opacity-80",
              "duration-[400]",
              "ease-in-out",
              "transition-opacity",
              "ml-auto",
              "flex-shrink-0",
              "relative",
              "z-[50]"
            )}
          />
        )}
      </form>
    </div>
  );
}

export default forwardRef(Search);
