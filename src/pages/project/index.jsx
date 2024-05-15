import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ProjectDetails from "@/components/Project/components/ProjectDetails";
import { project } from "@/constants/data";

// export default function Project({ params: { ProjectId } }) {
export default function Project({ ProjectId = "HvkrAjHJ-38" }) {
  const Single_data = project?.filter((data) => data.video_key === ProjectId);

  return (
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
          <ArrowLeftIcon className="size-4 mr-[5px]" />
          <span className="text-base">Back</span>
        </Link>
      </div>
      <ProjectDetails Single_data={Single_data} />
      {/* <Footer /> */}
    </div>
  );
}
