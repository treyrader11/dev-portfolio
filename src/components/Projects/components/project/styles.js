import { cn } from "@/lib/utils";

const styles = {
  container: cn(
    "h-screen",
    "flex",
    "items-center",
    "justify-center",
    "sticky",
    "top-0"
  ),
  h2: cn("text-[28px]", "m-0", "text-center"),
  body: cn("flex", "h-full", "mt-[50px]", "gap-[50px]"),
  description: cn("relative", "w-[40%]", "top-[10%]"),
  imageContainer: cn(
    "relative",
    "w-[60%]",
    "h-full",
    "rounded-[25px]",
    "overflow-hidden"
  ),
  inner: cn("w-full", "h-full"),
};

export default styles;
