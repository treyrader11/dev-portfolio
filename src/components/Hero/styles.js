import { cn } from "@/lib/utils";

const styles = {
  container: cn("h-screen", "bg-dark", "custom-font", "relative"),
  mask: cn(
    "w-full",
    "h-full",
    "flex",
    "items-center",
    "text-3xl",
    "md:text-[64px]",
    "md:leading-[66px]"
  ),
  body: cn(
    "w-full",
    "h-full",
    "flex",
    "items-center",
    "text-light-400",
    "text-3xl",
    "md:text-[64px]",
    "md:leading-[66px]"
  ),
  p: cn("w-[1000px]", "p-[40px]"),
};

export default styles;
