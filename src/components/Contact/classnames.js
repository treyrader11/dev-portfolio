import { cn } from "@/lib/utils";

export default styles = {
  contact: cn(
    "text-white",
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "bg-dark",
    "relative"
  ),
  container: cn("pt-[200px]", "w-full", "bg-dark"),
  title: cn(
    "border-b-[1px]",
    "border-light-300",
    "pb-[100px]",
    "mx-[200px]",
    "relative"
  ),
  imageContainer: cn(
    "w-[100px]",
    "h-[100px]",
    "relative",
    "rounded-full",
    "overflow-hidden"
  ),
  buttonContainer: cn(
    "absolute",
    "left-[calc(100%_-_400px)]",
    "top-[calc(100%_-_75px)]"
  ),
  button: cn(
    "w-[180px]",
    "h-[180px]",
    "bg-primary-500",
    "text-white",
    "rounded-full",
    "absolute",
    "flex",
    "items-center",
    "justify-center",
    "cursor-pointer"
  ),
  p: cn("m-0", "text-[16px]", "font-light", "z-[2]", "relative"),
  svg: cn("absolute", "top-[30%]", "left-full"),
  nav: cn("flex", "gap-5", "mt-[100px]", "mx-[200px]"),
  info: cn("flex", "justify-between", "mt-[200px]", "p-5"),
  infoText: cn(
    "m-0",
    "p-[2.5px]",
    "cursor-pointer",
    "after:w-0",
    "after:h-[1px]",
    "after:bg-white",
    "after:block",
    "after:mt-[2px]",
    "after:relative",
    "after:left-[50%]",
    "after:transform",
    "-after:translate-x-[50%]",
    "after:transition-width",
    "after:duration-200",
    "after:ease-linear",
    "hover:after:w-full"
  ),
  infoheading: cn("m-0", "p-[2.5px]", "cursor-pointer"),
  span: cn("flex", "flex-col", "gap-[15px]"),
};
