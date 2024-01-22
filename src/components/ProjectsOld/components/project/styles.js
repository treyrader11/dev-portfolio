import { cn } from "@/lib/utils";

const styles = {
  project: cn(
    "group",
    "flex",
    "w-full",
    "justify-between",
    "items-center",
    "py-[50px]",
    "px-[100px]",
    "cursor-pointer",
    "transition-all",
    "duration-200",
    "hover:opacity-50",
    "border-slate-300",
    "border-t-[1px]"
  ),
  h2: cn(
    "text-[60px]",
    "m-0",
    "font-normal",
    "transition-all",
    "duration-400",
    "transform",
    "group-hover:-translate-x-[10px]"
  ),
  p: cn(
    "transition-all",
    "duration-400",
    "font-light",
    "transform",
    "group-hover:translate-x-[10px]"
  ),
};

export default styles;
