import { cn } from "@/lib/utils";

export default function BurgerMenu({ isOpen }) {
  return (
    <div
      className={cn(
        "relative",
        "w-full",
        "z-[1]",
        // first line
        "after:block",
        "after:h-px",
        "after:w-[40%]",
        "after:m-auto",
        "after:bg-white",
        "after:relative",
        "after:transition-transform",
        "after:duration-300",
        // second line
        "before:block",
        "before:h-px",
        "before:w-[40%]",
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
  );
}
