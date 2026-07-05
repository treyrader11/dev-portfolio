import type { NextPage, GetStaticProps } from "next";
import Inner from "@/components/layout/Inner";
import PageTitle from "@/components/PageTitle";
import Portfolio from "@/components/Portfolio";
import { getAllProjects } from "@/features/portfolio/lib/projects";
import { getPortfolioIntro } from "@/lib/db/content";
import { getUserData } from "@/features/profile/lib/get-user-data";
import { getManagedRepos } from "@/features/github/lib/github";
import { cn } from "@/lib/utils";
import type { ProjectData } from "@/types/data";
import type { GithubRepoSummary } from "@/features/github/types";

interface PortfolioPageProps {
  repositories: GithubRepoSummary[];
  projects: ProjectData[];
  intro: string;
}

const PortfolioPage: NextPage<PortfolioPageProps> = ({
  repositories,
  projects,
  intro,
}) => {
  return (
    <Inner backgroundColor="#934E00">
      <PageTitle
        once
        title="Portfolio."
        className={cn("absolute", "mt-12", "sm:mt-10", "md:mt-5")}
        containerClass={cn("py-[90px]", "sm:py-[100px]", "z-50")}
      />
      <Portfolio repositories={repositories} projects={projects} intro={intro} />
    </Inner>
  );
};

export default PortfolioPage;

// Static generation + ISR: HTML is prebuilt (great for SEO, zero client fetch)
// and revalidated periodically so admin CMS edits surface without a rebuild.
export const getStaticProps: GetStaticProps<PortfolioPageProps> = async () => {
  const token = process.env.GITHUB_AUTH_TOKEN;
  const { githubUsername } = await getUserData();
  const [repositories, projects, intro] = await Promise.all([
    getManagedRepos(githubUsername, token),
    getAllProjects(),
    getPortfolioIntro(),
  ]);
  return {
    props: { repositories, projects, intro },
    revalidate: 60,
  };
};
