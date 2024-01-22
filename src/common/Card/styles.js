import { cn } from "@/lib/utils";

// When positioned absolute, height needs to be 70
const beforeHeight = 70;
// const beforeHeight = 100;

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
            // "before:skew-y-[-6]",
          )
        : "rounded-3xl"
    ),
};

const className =
  "absolute inset-0 z-0 transform -skew-y-6 bg-gradient-to-r from-purple-100 to-purple-50";

export default styles;
