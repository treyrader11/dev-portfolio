import { cn } from "@/lib/utils";

const styles = {
  menu: cn(
    "h-screen",
    "bg-dark-600",
    "fixed",
    "right-0",
    "top-0",
    "text-white",
    "z-[3]"
  ),
  body: cn("h-full", "p-[100px]", "flex", "flex-col", "justify-between"),
  nav: cn("flex", "flex-col", "text-[56px]", "gap-[12px]", "mt-[80px]"),
  header: cn(
    "text-light-100",
    "border-b-[1px]",
    "border-light-500",
    "uppercase",
    "text-[11px]",
    "mb-[40px]"
  ),
  link: cn("no-underline", "text-white", "font-light"),
};

export default styles;