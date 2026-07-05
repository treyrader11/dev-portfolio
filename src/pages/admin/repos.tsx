import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { AdminReposPage } from "@/features/github/components/admin-repos-page";
import { getUserData } from "@/features/profile/lib/get-user-data";
import {
  fetchAllRepos,
  getRepoSettings,
  type GithubRepoSummary,
  type GithubRepoSettings,
} from "@/features/github/lib/github";

interface Props {
  repos: GithubRepoSummary[];
  settings: GithubRepoSettings;
}

export default function AdminRepos({ repos, settings }: Props) {
  return <AdminReposPage repos={repos} settings={settings} />;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session?.user?.isAdmin) {
    return { redirect: { destination: "/admin/signin", permanent: false } };
  }

  const { githubUsername } = await getUserData();
  const token = process.env.GITHUB_AUTH_TOKEN;
  const [repos, settings] = await Promise.all([
    fetchAllRepos(githubUsername, token),
    getRepoSettings(),
  ]);

  return { props: { repos, settings } };
};
