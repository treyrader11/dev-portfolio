import { cn } from "@/lib/utils";

const styles = {
  slidingImages: cn(
    "flex",
    "flex-col",
    "gap-[3vw]",
    "relative",
    "mt-[200px]",
    "bg-white",
    "z-[1]"
  ),
  slider: cn("flex", "relative", "gap-[3vw]", "w-[120vw]", "-left-[10vw]"),
  project: cn("w-[25%]", "h-[20vw]", "flex", "items-center", "justify-center"),
  imageContainer: cn("relative", "w-[80%]", "h-[80%]"),
  circleContainer: cn("bg-red-500", "relative", "mt-[100px]"),
  circle: cn(
    "h-[1550%]",
    "w-[120%]",
    "-left-[10%]",
    "rounded-tl-none",
    "rounded-tr-none",
    "rounded-bl-full",
    "rounded-br-full",
    "bg-white",
    "z-[1]",
    "absolute",
    // "shadow-lg",
    "custom-shadow"
  ),
};

export default styles;
