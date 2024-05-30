import { cn } from "@/lib/utils";
import ProjectDetails from "@/components/Project/components/ProjectDetails";
import { projectsData } from "@/lib/data";
import Inner from "@/components/layout/Inner";
import PageTitle from "@/components/PageTitle";
import GoBack from "@/components/GoBack";

export default function ProjectPage({ project }) {
  return (
    <Inner backgroundColor="#934E00" className="">
      <PageTitle
        once
        title={`${project[0].title}`}
        backgroundColor="transparent"
        className={cn(
          "absolute",
          "mt-12",
          "z-50",
          "inset-x-0",
          "sm:mt-10",
          "md:mt-5",
          "px-3",
          "pt-20"
        )}
        containerClass={cn("h-48 z-50")}
      />
      {/* <GoBack /> */}
      {project && <ProjectDetails data={project} />}
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
