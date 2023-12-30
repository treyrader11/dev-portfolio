import { cn } from "@/lib/utils";

const styles = {
  el: cn(
    "group",
    "flex",
    "flex-col",
    "relative",
    "z-[1]",
    "p-[15px]",
    "cursor-pointer",
    "hover:transform",
    "hover:scale-100"
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
    "group-hover:scale-2",
    "transform",
    "-translate-x-[50%]",
    // "bg-white",
    "bg-dark",
    "rounded-full"
  ),
};

export default styles;
