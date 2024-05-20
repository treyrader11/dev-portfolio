import { cn } from "@/lib/utils";

export default function Input({ className, type, placeholder }) {
  return (
    <input
      placeholder={placeholder}
      type={type}
      className={cn(
        "w-full",
        "py-4",
        "px-6",
        "rounded-[30px]",
        "border-none",
        "resize-none",
        "bg-dark-400",
        "focus:outline-purple-400",
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
