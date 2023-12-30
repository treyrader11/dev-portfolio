import { cn } from "@/lib/utils";

export default {
  introduction: cn(
    "h-screen",
    "w-screen",
    "flex",
    "items-center",
    "justify-center",
    "fixed",
    "z-[99]",
    "bg-dark"
  ),
  svg: cn("absolute", "top-0", "w-full", "h-[calc(100%+300px)]"),
  path: "fill-dark",
  p: cn("flex", "text-white", "text-6xl", "items-center", "absolute", "z-10"),
  span: cn(
    "block",
    "w-[10px]",
    "h-[10px]",
    "bg-white",
    "rounded-[50%]",
    "mr-[10px]"
  ),
};
