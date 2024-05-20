import { cn } from "@/lib/utils";

// When positioned absolute, height needs to be 70
const beforeHeight = 100;

const styles = {
  card: (isFolderShaped) =>
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
            "before:absolute",
            // "before:relative",
            `before:h-[${beforeHeight}px]`,
            "before:w-1/2",
            "before:rounded-t-3xl",
            "before:bg-inherit",
            `before:top-[-${beforeHeight}px]`,
            "before:left-0",
          )
        : cn("rounded-3xl")
    ),
};

export default styles;
