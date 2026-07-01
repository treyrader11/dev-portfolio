import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { cn } from "@/lib/utils";
import ProjectDetails from "@/components/Project/components/ProjectDetails";
import {
  getProjectBySlug,
  getProjectSlugs,
} from "@/features/portfolio/lib/projects";
import Inner from "@/components/layout/Inner";
import PageTitle from "@/components/PageTitle";
import type { ProjectData } from "@/types/data";

interface PortfolioProjectPageProps {
  project: ProjectData[];
}

const PortfolioProjectPage: NextPage<PortfolioProjectPageProps> = ({
  project,
}) => {
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
      {project && <ProjectDetails data={project} />}
    </Inner>
  );
};

export default PortfolioProjectPage;

interface PortfolioProjectParams {
  project: string;
  [key: string]: string;
}

export const getStaticPaths: GetStaticPaths<
  PortfolioProjectParams
> = async () => {
  const slugs = await getProjectSlugs();
  return {
    paths: slugs.map((project) => ({ params: { project } })),
    // Projects created via the admin CMS are rendered on first request and then
    // cached — no rebuild needed, and the HTML stays static for SEO.
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<
  PortfolioProjectPageProps,
  PortfolioProjectParams
> = async ({ params }) => {
  const slug = params?.project;
  const project = slug ? await getProjectBySlug(slug) : null;

  if (!project) {
    return { notFound: true, revalidate: 60 };
  }

  return {
    props: { project: [project] },
    revalidate: 60,
  };
};
