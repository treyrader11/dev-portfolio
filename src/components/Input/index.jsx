import { cn } from "@/lib/utils";

export default function Input({ className, placeholder, ...attributes }) {
  return (
    <input
      {...attributes}
      placeholder={placeholder}
      className={cn(
        "w-full",
        "py-4",
        "px-6",
        "rounded-[30px]",
        "border-none",
        "resize-none",
        "bg-dark-400",
        "focus:outline-secondary",
        "outline-[1px]",
        "transition-all",
        "duration-300",
        "ease-in-out",
        "bg-slate-100",
        "text-black",
        className
      )}
    />
  );
}
