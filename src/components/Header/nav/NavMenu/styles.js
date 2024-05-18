import { cn } from "@/lib/utils";

const styles = {
  nav: cn("flex", "items-center"),
  navItem: cn(
    "group",
    "flex",
    "flex-col",
    "relative",
    "z-[1]",
    "p-[15px]",
    // "hover:text-[#A953D7]"
  ),
  indicator: cn(
    "top-[45px]",
    "absolute",
    "left-[50%]",
    "w-[5px]",
    "h-[5px]",
    "transition-transform",
    "duration-200",
    "custom-ease-in-out",
    "scale-0",
    "transform",
    "-translate-x-[50%]",
    "bg-dark",
    "rounded-full",
    "group-hover:scale-100",
    "bg-white",
  ),
  
};

export default styles;
