import { cn } from "@/lib/utils";

export default {
  landing: cn("relative", "flex", "h-screen", "overflow-hidden"),
  sliderContainer: cn("absolute", "top-[calc(100vh_-_350px)]"),
  description: cn(
    "absolute",
    "top-[35%]",
    "left-[65%]",
    "text-white",
    "text-2xl",
  ),
  p: cn("m-0", "mb-[10px]"),
  svg: cn("transform", "scale-2", "mb-[100px]"),
};
