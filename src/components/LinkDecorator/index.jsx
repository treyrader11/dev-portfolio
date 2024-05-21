import { cn } from "@/lib/utils";

export default function LinkDecorator({ className, isActive }) {
  return (
    <div
      className={cn(
        "size-[5px]",
        "transition-transform",
        "duration-200",
        "custom-ease-in-out",
        "transform",
        "-translate-x-1/2",
        "rounded-full",
        "bg-white",
        "mx-auto",
        "mt-3",
        "scale-0",
        "group-hover:scale-100",
        isActive && cn("scale-100"),
        className
      )}
    />
  );
}
