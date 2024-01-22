import { cn } from "@/lib/utils";

const styles = {
  description: cn("px-[200px]", "mt-[200px]", "flex", "justify-center"),
  container: cn("flex", "gap-[50px]", "relative", "bg-red-500"),
  mask: cn("relative", "overflow-hidden", "inline-flex"),
  button: cn(
    "top-[80%]",
    "left-[clac(100%_-_400px)]",
    "w-[180px]",
    "h-[180px]",
    "bg-dark-400",
    "text-white",
    "rounded-full",
    "absolute",
    "flex",
    "items-center",
    "justify-center",
    "cursor-pointer"
  ),
  buttonText: cn("m-0", "text-[16px]", "font-light", "relative", "z-[1]"),
  p: cn("m-0"),
};

export default styles;
