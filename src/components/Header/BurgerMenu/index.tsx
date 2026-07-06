"use client";

import Rounded from "@/components/Rounded";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface Props {
  isOpen: boolean;
  handleNavMenu: () => void;
}

const BurgerMenu = forwardRef<HTMLDivElement, Props>(
  function BurgerMenu({ isOpen, handleNavMenu }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "fixed",
          "transform",
          "scale-0",
          "right-0",
          // Above the nav overlay (2147483645) so the burger stays clickable to
          // close the menu while it's open.
          "z-[2147483646]",
          "after:top-[-5px]",
          "before:top-[5px]",
          // Sits just below the resume corner badge (fixed top-0, h-20 = 80px):
          // the circle's bottom = top + m-5 margin + size-16 = 4 + 20 + 64 = 88px.
          "top-1"
        )}
      >
        <Rounded
          onClick={handleNavMenu}
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
              "after:block",
              "after:h-px",
              "after:w-2/5",
              "after:m-auto",
              "after:bg-white",
              "after:relative",
              "after:transition-transform",
              "after:duration-300",
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
);

export default BurgerMenu;
