import type { NextPage, GetServerSideProps } from "next";
import Inner from "@/components/layout/Inner";
import PageTitle from "@/components/PageTitle";
import Portfolio from "@/components/Portfolio";
import { userData } from "@/lib/data";
import { getLatestRepos } from "@/lib/getLatestRepos";
import { cn } from "@/lib/utils";

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
}

const PortfolioPage: NextPage<PortfolioPageProps> = ({ repositories }) => {
  return (
    <Inner backgroundColor="#934E00">
      <PageTitle
        once
        title="Portfolio."
        className={cn(
          // "py-[125px]",
          "absolute",
          "mt-12",
          "sm:mt-10",
          "md:mt-5"
        )}
        containerClass={cn(
          // "py-[125px]",
          // "sm:py-[130px]",
          // "md:py-[110px]"
          "py-[90px]",
          "sm:py-[100px]",
          "z-50"
        )}
      />
      <Portfolio repositories={repositories} />
    </Inner>
  );
};

export default PortfolioPage;

export const getServerSideProps: GetServerSideProps<PortfolioPageProps> = async () => {
  const token = process.env.GITHUB_AUTH_TOKEN;
  const repositories = (await getLatestRepos(userData, token)) ?? [];
  return {
    props: {
      repositories,
    },
  };
};
