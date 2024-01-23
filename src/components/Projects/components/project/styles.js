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
  description: cn("relative", "w-[40%]", "top-[10%]", "custom-font-body"),
  imageContainer: cn(
    "relative",
    "w-[60%]",
    "h-full",
    "rounded-3xl",
    "overflow-hidden"
  ),
  // inner: cn("w-full", "h-full"),
  inner: cn("w-full", "h-full", "relative"),
  card: (isFolderShaped, beforeHeight) =>
    cn(
      "flex",
      "flex-col",
      "relative",
      "-top-[25%]",
      "h-[500px]",
      "max-w-[1500px]",
      "p-[50px]",
      "origin-top",
      "border-3",
      "border-red-500",
      isFolderShaped
        ? cn(
            "rounded-tr-3xl",
            "rounded-b-3xl",
            // "before:absolute",
            "before:relative",
            `before:h-[${beforeHeight}px]`,
            "before:w-1/2",
            "before:rounded-t-3xl",
            "before:bg-inherit",
            `before:top-[-${beforeHeight}px]`,
            "before:left-0"
          )
        : "rounded-3xl"
    ),
};

export default styles;
