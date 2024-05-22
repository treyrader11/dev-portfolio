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
        const selectedClass = cn(
          "after:bg-purple-500",
          "text-purple-500",
          "after:opacity-100"
        );
        return (
          <button
            key={index}
            onClick={() => filterProjects(categ, index)}
            className={cn(
              selected === index && selectedClass,
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
              "after:opacity-0",
              "hover:after:opacity-100",
              "after:absolute",
              "after:block",
              "after:h-px",
              "after:w-full",
              "after:bg-white",
              "after:transition-[transform,opacity]",
              selected === index
                ? selectedClass
                : cn("hover:after:-translate-y-px", "after:translate-y-3")
            )}
          >
            {categ}
          </button>
        );
      })}
    </div>
  );
}
