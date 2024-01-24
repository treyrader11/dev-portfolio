import { cn } from "@/lib/utils";

const styles = {
  container: cn(
    "h-screen",
    "flex",
    "items-center",
    "justify-center",
    "sticky",
    "top-0",
     "max-w-[1080px]",
     "mx-auto",
  ),
  h2: cn("text-[28px]", "m-0", "text-center"),
  // body: cn("flex", "h-full", "mt-[50px]", "gap-[50px]"), <- original
  body: cn("flex", "flex-col", "sm:flex-row", "h-full", "justify-between", ""),
  // description: cn("relative", "w-[40%]", "top-[10%]", "custom-font-body"), <- original
  description: cn("relative", "w-[35%]", "hidden", "sm:flex", "custom-font-body"),
  imageContainer: cn(
    "relative",
    "w-full",
    "h-full",
    "rounded-3xl",
  ),
  inner: cn("w-full", "h-full"),
  // inner: cn("w-full", "h-full", "relative", "overflow-hidden"),
  card: (isFolderShaped, beforeHeight) =>
    cn(
      "flex",
      "flex-col",
      "relative",
      // "-top-[25%]",
      "h-[500px]",
      // "max-w-[1500px]",
      "p-[50px]",
      "w-full",
      "origin-top",
      "border-3",
      "border-red-500",
      "overflow-clip",
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
