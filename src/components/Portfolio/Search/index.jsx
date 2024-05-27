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
      
        className
      )}
    >
      <form
        className={cn(
          "duration-700",
          "transition-[border,width]",
          "ease-in-out",
          "bg-transparent",
          "border-slate-200",
          "flex items-center",
          "overflow-hidden",
          "text-2xl",
          "w-10",
          "ml-0",
          "relative",
          // "py-2",
          isFocused
            ? cn("w-full", "md:w-[36vw]", "md:max-w-[80]", "border-b-[.3px]")
            : "border-none"
        )}
      >
        <FiSearch
          onClick={onClick}
          className="fixed flex flex-shrink-0 text-3xl cursor-pointer w-fit"
        />
        <input
          ref={ref}
          placeholder="Search by tech..."
          onChange={(e) => onChange(e.target.value)}
          type="text"
          autoComplete="off"
          className={cn(
            "px-3",
            "ml-8",
            "sm:ml-12",
            "font-light",
            "placeholder:font-light",
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
