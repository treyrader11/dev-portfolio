"use client";

import { cn } from "@/lib/utils";
import { FiSearch } from "react-icons/fi";
import { MdClear } from "react-icons/md";
import { forwardRef } from "react";

function Search({ className, onChange, clearInput, onClick, isFocused }, ref) {
  return (
    <div className={cn("flex items-center text-white gap-x-2", className)}>
      <FiSearch onClick={onClick} className="text-2xl cursor-pointer" />
      
      <input
        ref={ref}
        placeholder="Search by tech..."
        onChange={(e) => onChange(e.target.value)}
        type="text"
        autoComplete="off"
        className={cn(
          "duration-700",
          "transition-[border,width]",
          "ease-in-out",
          "bg-transparent",
          "font-light",
          "placeholder:font-light",
          "placeholder:text-gray-500",
          "focus-visible:outline-none",
          "border-slate-200",
          isFocused
            ? "w-[36vw] max-w-40 border-b-[.3px] opacity-100"
            : "w-0 opacity-0 border-none outline-none ring-0"
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
            "transition-opacity"
          )}
        />
      )}
    </div>
  );
}

export default forwardRef(Search);
