import { cn } from "@/lib/utils";

export default {
  logo: cn("group", "flex", "cursor-pointer"),
  p: cn("m-0", "transition-all", "duration-500", "custom-ease-in-out"),
  name: cn(
    "flex",
    "relative",
    "overflow-hidden",
    "whitespace-nowrap",
    "ml-[5px]",
    "transition-all",
    "duration-500",
    "custom-ease-in-out",
  ),
  copyright: cn("group-hover:rotate-360"),
  codeBy: cn("group-hover:-translate-x-full"),
  trey: cn("group-hover:-translate-x-[65px]"),
  rader: cn("group-hover:-translate-x-[80px]"),
  p2: cn(
    "relative",
    "transition-transform",
    "duration-500",
    "custom-ease-in-out"
  ),
};
