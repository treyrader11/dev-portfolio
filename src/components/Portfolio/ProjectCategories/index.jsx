import { cn } from "@/lib/utils";

export default function ProjectCategories({
  categories,
  className,
  selected,
  filterProjects,
}) {
  return (
    <div
      className={cn(
        "mt-8",
        "pt-3",
        "px-6",
        "flex",
        "items-center",
        "gap-[1.5rem]",
        className
      )}
    >
      {categories.map((categ, index) => {
        const activeClass = cn(
          { selected },
          "relative",
          "after:absolute",
          "after:block",
          "after:h-[2px]",
          "after:w-full",
          "after:bg-purple-500",
          "text-purple-500",
          "after:transition-[transform,opacity]",
          "[&:not(.active)]:after:translate-y-2",
          "[&:not(.active)]:after:opacity-0",
          "hover:[&:not(.active)]:after:translate-y-0",
          "hover:[&:not(.active)]:after:opacity-100"
        );
        return (
          <button
            key={index}
            onClick={() => filterProjects(categ, index)}
            className={cn(
              "inline-block",
              "font-semibold",
              "text-white",
              "border-none",
              "outline-none",
              "cursor-pointer",
              "relative",
              "transition-all",
              "duration-300",
              "ease-in-out",
              selected === index ? activeClass : ""
            )}
          >
            {categ}
          </button>
        );
      })}
    </div>
  );
}
