import { cn } from "@/lib/utils";

const styles = {
  header: cn(
    "absolute",
    "flex",
    "z-[1]",
    "top-0",
    "text-white",
    "p-[35px]",
    "justify-between",
    "items-center",
    "w-full"
  ),
  nav: cn("flex", "items-center"),
  headerButtonContainer: cn(
    "fixed",
    "transform",
    "scale-0",
    "right-0",
    "z-[4]"
  ),
  button: cn(
    "relative",
    "m-5",
    "w-[80px]",
    "h-[80px]",
    "rounded-full",
    "bg-dark-400",
    "cursor-pointer",
    "flex",
    "items-center",
    "justify-center"
  ),

  burger: ({ isActive }) =>
    cn(
      "relative",
      "w-full",
      "z-[1]",
      "after:block",
      "after:h-[1px]",
      "after:w-[40%]",
      "after:m-auto",
      "after:bg-white",
      "after:relative",
      "after:transition-transform",
      "after:duration-300",
      "after:-top-[5px]",
      isActive
        ? "after:transform after:rotate-45 after:-top-[1px]"
        : "after:-top-[5px]"
    ),
};

export default styles;