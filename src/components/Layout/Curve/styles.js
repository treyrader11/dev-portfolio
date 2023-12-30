import { cn } from "@/lib/utils";

const styles = {
  curve: cn("p-[40px]", "min-h-screen"),
  background: cn(
    "fixed",
    "left-0",
    "top-0",
    "w-screen",
    "h-[calc(100vh_+_600px)]",
    "pointer-events-none",
    "bg-dark",
    "transition-opacity",
    // "duration-none",
    "duration-0",
    "ease-linear",
    "delay-100"
  ),
  route: cn(
    "absolute",
    "left-[50%]",
    "top-[40%]",
    "text-white",
    "text-[46px]",
    "z-[99]",
    "text-center",
    "transform",
    "translate-x-[-50%]"
  ),
};

export default styles;
