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
        // "flex-nowrap",
        "items-center",
        "gap-[1.5rem]",
        "overflow-x-auto",
        "overflow-y-hidden",
        "no-scrollbar",
        "max-h-fit",
        "min-h-fit",
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
              "whitespace-nowrap",
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
      <div
        className={cn(
          "absolute",
          "inset-y-0",
          "right-0",
          "z-10",
          "w-20",
          "bg-gradient-to-l",
          "from-dark",
          "to-transparent",
          "lg:hidden"
        )}
      />
    </div>
  );
}
