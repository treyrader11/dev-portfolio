import { cn } from "@/lib/utils";

export default function ProjectCategories({
  categories,
  selected,
  filterProjects,
}) {
  return (
    <>
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
      {/* <div
        className={cn(
          "fixed",
          "inset-y-0",
          "right-0",
          "z-10",
          "w-24",
          "bg-gradient-to-l",
          "from-dark",
          "to-transparent",
          "lg:hidden",
          "h-5"
        )}
      /> */}
    </>
  );
}
