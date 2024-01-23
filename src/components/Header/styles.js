import { cn } from "@/lib/utils";

const styles = {
  header: cn(
    "absolute",
    "flex",
    "z-[5]",
    "top-0",
    "font-extralight",
    "text-white",
    "p-[35px]",
    "justify-between",
    "items-center",
    "w-full"
  ),
  logo: (isHomePage) =>
    cn("pl-3", "mr-auto", isHomePage ? "text-white" : "text-black"),
  navMenu: (isHomePage) => cn(isHomePage ? "text-white" : "text-black"),
  navButtonContainer: cn(
    "fixed",
    "transform",
    "scale-0",
    "right-0",
    // "z-[10]",
    "z-[4]",
    "after:top-[-5px]",
    "before:top-[5px]"
  ),
  navButton: (isNavOpen) =>
    cn(
      "relative",
      "m-5",
      "w-[80px]",
      "h-[80px]",
      "rounded-full",
      isNavOpen ? cn("bg-primary") : cn("bg-dark-400")
    ),

  burger: (isNavOpen) =>
    cn(
      "relative",
      "w-full",
      "z-[1]",
      // first line
      "after:block",
      "after:h-[1px]",
      "after:w-[40%]",
      "after:m-auto",
      "after:bg-white",
      "after:relative",
      "after:transition-transform",
      "after:duration-300",
      // second line
      "before:block",
      "before:h-[1px]",
      "before:w-[40%]",
      "before:m-auto",
      "before:bg-white",
      "before:relative",
      "before:transition-transform",
      "before:duration-300",
      isNavOpen
        ? cn(
            "after:transform",
            "after:rotate-45",
            "after:-top-[1px]",
            "before:-rotate-45",
            "before:top-0"
          )
        : cn("after:-top-[5px]", "before:top-[5px]")
    ),
};

export default styles;
