import { cn } from "@/lib/utils";

const styles = {
  roundedButton: cn(
    "rounded-[3em]", //not sure if this works
    "border-light-200",
    "border-px",
    "cursor-pointer",
    "relative",
    "flex",
    "items-center",
    "justify-center",
    "py-[15px]",
    "px-[60px]",
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
  circle: cn("w-full", "h-[150%]", "absolute", "rounded-1/2", "top-full", "z-[12]", "bg-primary"),
};

export default styles;