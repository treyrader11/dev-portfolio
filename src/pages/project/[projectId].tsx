import type { NextPage, GetServerSideProps } from "next";
import { cn } from "@/lib/utils";
import ProjectDetails from "@/components/Project/components/ProjectDetails";
import { projectsData } from "@/lib/data";
import Inner from "@/components/layout/Inner";
import PageTitle from "@/components/PageTitle";
import GoBack from "@/components/GoBack";
import type { ProjectData } from "@/types/data";

interface ProjectPageProps {
  project: ProjectData[];
}

const ProjectPage: NextPage<ProjectPageProps> = ({ project }) => {
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
};

export default ProjectPage;

interface ProjectPageParams {
  projectId: string;
  [key: string]: string;
}

export const getServerSideProps: GetServerSideProps<ProjectPageProps, ProjectPageParams> = async ({ params }) => {
  const projectId = params?.projectId;

  const project = projectsData.filter(
    ({ video_key }) => video_key === projectId
  );

  return {
    props: { project },
  };
};
