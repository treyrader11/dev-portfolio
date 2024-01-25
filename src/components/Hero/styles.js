import { cn } from "@/lib/utils";

const styles = {
  container: cn("h-screen", "bg-dark", "custom-font", "relative", ""),
  mask: cn(
    "w-full",
    "h-full",
    "flex",
    "items-center",
    "text-3xl",
    "md:text-[64px]",
    "md:leading-[66px]",
    "mask"
  ),
  body: cn(
    "w-full",
    "h-full",
    "flex",
    "items-center",
    "text-light-400",
    "text-3xl",
    "md:text-[64px]",
    "md:leading-[66px]",
    
  ),
  p: cn("w-[1000px]", "p-[40px]"),
  heading: (isTargetedWord) =>
    cn("mr-3", "inline-flex", isTargetedWord ? "text-[#A953D7]" : "text-light-400"),
};

export default styles;
