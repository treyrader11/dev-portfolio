import userData from "@/constants/data";
import { cn } from "@/lib/utils";

export default function Projects() {
  return (
    <section className="bg-white dark:bg-gray-800">
      <div
        className={cn(
          "h-48",
          "max-w-6xl",
          "mx-auto",
          "bg-white",
          "dark:bg-gray-800"
        )}
      >
        <h1
          className={cn(
            "py-20",
            "text-5xl",
            "font-bold",
            "text-center",
            "md:text-9xl",
            "md:text-left",
            "absolute",
            "top-[7%]",
            "z-[999]",
            "text-purple-600"
          )}
        >
          Projects
        </h1>
      </div>
      {/* Grid starts here */}
      <div className="bg-[#F1F1F1] dark:bg-gray-900">
        <div
          className={cn(
            "grid",
            "max-w-6xl",
            "grid-cols-1",
            "gap-8",
            "py-20",
            "pb-40",
            "mx-auto",
            "md:grid-cols-2",
          )}
        >
          {userData.projects.map((proj, idx) => (
            <ProjectCard
              title={proj.title}
              link={proj.link}
              imgUrl={proj.imgUrl}
              number={`${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectCard({ title, link, imgUrl, number }) {
  return (
    <a href={link} className="block w-full shadow-2xl">
      <div className="relative overflow-hidden">
        <div className="object-cover h-72">
          <img
            src={imgUrl}
            alt="portfolio"
            className={cn(
              "object-cover",
              "w-full",
              "h-full",
              "transition",
              "ease-out",
              "transform",
              "hover:scale-125",
              "duration-2000"
            )}
          />
        </div>
        <h1
          className={cn(
            "absolute",
            "px-2",
            "text-xl",
            "font-bold",
            "bg-red-500",
            "rounded-md",
            "top-10",
            "left-10",
            "text-gray-50"
          )}
        >
          {title}
        </h1>
        <h1
          className={cn(
            "absolute",
            "text-xl",
            "font-bold",
            "bottom-10",
            "left-10",
            "text-gray-50"
          )}
        >
          {number.length === 1 ? "0" + number : number}
        </h1>
      </div>
    </a>
  );
}
