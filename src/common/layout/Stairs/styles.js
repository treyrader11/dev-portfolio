import { cn } from "@/lib/utils";

const styles = {
  container: cn(
    "fixed",
    "w-screen",
    "h-screen",
    "flex",
    "left-0",
    "top-0",
    "pointer-events-none",
    "z-[99]"
  ),
  background: cn(
    "fixed",
    "w-full",
    "h-screen",
    "z-[50]",
    "pointer-events-none",
    "top-0",
    "left-0"
  ),
  div: cn("relative", "h-full", "w-full", "bg-black"),
};

export default styles;
