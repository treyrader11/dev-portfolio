import Link from "next/link";
import { cn } from "@/lib/utils";
import ProjectDetails from "@/components/Project/components/ProjectDetails";
import { projectsData } from "@/lib/data";
import Inner from "@/components/layout/Inner";
import { GoArrowLeft } from "react-icons/go";

export default function ProjectPage({ project }) {
  return (
    <Inner backgroundColor="#934E00">
      <div
        className={cn(
          "w-full",
          "min-h-screen",
          "m-auto",
          "pt-[62px]",
          "flex",
          "flex-col",
          "items-center",
          "justify-start"
        )}
      >
        <div
          className={cn(
            "w-full",
            "1250:w-[1210px]",
            "min-h-[70px]",
            "flex",
            "flex-row",
            "items-center",
            "justify-start",
            "px-2.5",
            "600:px-[15px]",
            "1250:px-0"
          )}
        >
          <Link
            href={"/"}
            className={cn(
              "static",
              "flex",
              "flex-row",
              "items-center",
              "justify-start",
              "cursor-pointer",
              "1000:fixed",
              "text-slate-200",
              "hover:text-sky-500"
            )}
          >
            <GoArrowLeft className="size-4 mr-[5px]" />
            <span className="text-base">Back</span>
          </Link>
        </div>
        {project && <ProjectDetails data={project} />}
      </div>
    </Inner>
  );
}

export async function getServerSideProps({ params }) {
  const { projectId } = params;

  const project = projectsData.filter(
    ({ video_key }) => video_key === projectId
  );

  return {
    props: { project },
  };
}
