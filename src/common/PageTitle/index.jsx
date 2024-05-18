import { cn } from "@/lib/utils";

export default function PageTitle({ className, backgroundColor, title }) {
  return (
    <div
      style={{ backgroundColor }}
      className={cn("h-48 mx-auto bg-dark-400 px-6")}
    >
      <h1
        className={cn(
          "py-[130px]",
          "md:py-[110px]",
          // "py-[2.6em]",
          // "text-6xl",
          "text-8xl",
          "font-bold",
          "text-center",
          "md:text-left",
          "text-left",
          "md:text-9xl",
          "text-secondary",
          className
        )}
      >
        {title}
      </h1>
    </div>
  );
}
