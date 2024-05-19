import { cn } from "@/lib/utils";

const styles = {
  inner: ({ className }) => cn("bg-black", className),
  page: cn("bg-white"),
  slide: cn(
    "h-screen",
    "w-full",
    "fixed",
    "z-[6]",
    "left-0",
    "top-0",
    "bg-white"
  ),
};

export default styles;