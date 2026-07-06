import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Inner from "@/components/layout/Inner";
import SocialMeta from "@/components/SocialMeta";
import RepoDetail from "@/features/github/components/repo-detail";
import { getUserData } from "@/features/profile/lib/get-user-data";
import {
  fetchRepoDetail,
  getManagedRepos,
  type GithubRepoDetail,
} from "@/features/github/lib/github";
import { titleCaseFromSlug } from "@/lib/utils";

interface RepoPageProps {
  repo: GithubRepoDetail;
}

const RepoPage: NextPage<RepoPageProps> = ({ repo }) => {
  const repoTitle = titleCaseFromSlug(repo.name);
  return (
    <Inner backgroundColor="#934E00">
      <SocialMeta
        title={`${repoTitle} — GitHub`}
        description={repo.description ?? `${repoTitle} repository by Trey Rader.`}
        card="summary"
        type="article"
        // Path stays the raw repo name — it's the URL slug / getStaticPaths key.
        path={`/portfolio/repo/${repo.name}`}
      />
      <RepoDetail repo={repo} />
    </Inner>
  );
};

export default RepoPage;

interface RepoParams {
  name: string;
  [key: string]: string;
}

export const getStaticPaths: GetStaticPaths<RepoParams> = async () => {
  const { githubUsername } = await getUserData();
  const token = process.env.GITHUB_AUTH_TOKEN;
  const repos = await getManagedRepos(githubUsername, token);
  return {
    // Prebuild the visible repos; any other repo renders on first request.
    paths: repos.map((r) => ({ params: { name: r.name } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<RepoPageProps, RepoParams> = async ({
  params,
}) => {
  const name = params?.name;
  const { githubUsername } = await getUserData();
  const token = process.env.GITHUB_AUTH_TOKEN;
  const repo = name
    ? await fetchRepoDetail(githubUsername, name, token)
    : null;

  if (!repo) return { notFound: true, revalidate: 60 };

  return { props: { repo }, revalidate: 300 };
};
