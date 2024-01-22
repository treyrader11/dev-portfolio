import { cn } from "@/lib/utils";

const styles = {
  projects: cn(
    "flex",
    "flex-col",
    "items-center",
    "px-[100px]",
    "mt-[300px]",
    "border-red-500",
    "border-[2px]"
  ),
  container: cn(
    "w-full",
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "mb-[100px]"
  ),
  modalContainer: cn(
    "h-[350px]",
    "w-[400px]",
    "fixed",
    "top-[50%]",
    "left-[50%]",
    "bg-white",
    "pointer-events-none",
    "overflow-hidden",
    "z-[3]"
  ),
  modalSlider: cn(
    "h-full",
    "w-full",
    "relative",
    "transition",
    "duration-500",
    "custom-ease-in-out"
  ),
  modal: cn("h-full", "w-full", "flex", "items-center", "justify-center"),
  cursor: cn(
    "w-[80px]",
    "h-[80px]",
    "rounded-full",
    "bg-[#455CE9]",
    "text-white",
    "fixed",
    "z-[3]",
    "flex",
    "items-center",
    "justify-center",
    "text-[14px]",
    "font-light",
    "pointer-events-none"
  ),
  p: cn(
    "relative",
    "z-[1]",
    "transition-colors",
    "duration-400",
    "ease-linear",
    "hover:text-white"
  ),
};

export default styles;
