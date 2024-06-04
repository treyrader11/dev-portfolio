"use client";

import Rounded from "@/components/Rounded";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

function BurgerMenu({ isOpen, handleNavMenu }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "fixed",
        // "transform",
        // "scale-0",
        "right-0",
        "z-[4]",
        "after:top-[-5px]",
        "before:top-[5px]",
        "top-8"
      )}
    >
      <Rounded
        onClick={handleNavMenu}
        // backgroundColor="#934e00"
        className={cn(
          "relative",
          "m-5",
          "size-16",
          "rounded-full",
          "cursor-pointer",
          "bg-dark",
          "p-0",
          { "bg-neutral-800": isOpen }
        )}
      >
        <div
          className={cn(
            "relative",
            "w-full",
            "z-[5]",
            // first line
            "after:block",
            "after:h-px",
            "after:w-2/5",
            "after:m-auto",
            "after:bg-white",
            "after:relative",
            "after:transition-transform",
            "after:duration-300",
            // second line
            "before:block",
            "before:h-px",
            "before:w-2/5",
            "before:m-auto",
            "before:bg-white",
            "before:relative",
            "before:transition-transform",
            "before:duration-300",
            isOpen
              ? cn(
                  "after:transform",
                  "after:rotate-45",
                  "after:-top-[1px]",
                  "before:-rotate-45",
                  "before:top-0"
                )
              : cn("after:-top-[5px]", "before:top-[5px]")
          )}
        />
      </Rounded>
    </div>
  );
}

export default forwardRef(BurgerMenu);
