import { cn } from "@/lib/utils";

export default {
  roundedButton: cn(
    "rounded-[3em]",
    "border-light-200",
    "border-[1px]",
    "cursor-pointer",
    "relative",
    "flex",
    "items-center",
    "justify-center",
    "py-[15px]",
    "px-[60px]"
  ),
  p: cn(
    "relative",
    "z-[1]",
    "transition-colors",
    "duration-400",
    "ease-linear",
    "hover:text-white"
    // might need to look into this hover situation
  ),
  circle: cn("w-full", "h-[150%]", "absolute", "rounded-full", "top-full"),
};
