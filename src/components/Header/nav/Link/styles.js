import { cn } from "@/lib/utils";

export default {
  link: cn("relative", "flex", "items-center"),
  indicator: cn(
    "w-[10px]",
    "h-[10px]",
    "bg-white",
    "rounded-full",
    "absolute",
    "-left-[30px]"
  ),
};
