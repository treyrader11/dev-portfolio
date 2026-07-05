import type { NextPage, GetStaticProps } from "next";
import Inner from "@/components/layout/Inner";
import PageTitle from "@/components/PageTitle";
import Portfolio from "@/components/Portfolio";
import { userData } from "@/lib/data";
import { getLatestRepos } from "@/lib/getLatestRepos";
import { getAllProjects } from "@/features/portfolio/lib/projects";
import { getPortfolioIntro } from "@/lib/db/content";
import { cn } from "@/lib/utils";
import type { ProjectData } from "@/types/data";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  clone_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
}

interface PortfolioPageProps {
  repositories: GitHubRepo[];
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
  const [repositories, projects, intro] = await Promise.all([
    getLatestRepos(userData, token).then((r) => r ?? []),
    getAllProjects(),
    getPortfolioIntro(),
  ]);
  return {
    props: { repositories, projects, intro },
    revalidate: 60,
  };
};
