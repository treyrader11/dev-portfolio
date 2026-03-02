import axios from "axios";
import type { UserData } from "@/types/data";

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

interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepo[];
}

export const getLatestRepos = async (
  data: Pick<UserData, "githubUsername">,
  token?: string
): Promise<GitHubRepo[] | undefined> => {
  console.log("data", data);
  try {
    const username = data.githubUsername;

    if (token) {
      const res = await axios.get<GitHubSearchResponse>(
        `https://api.github.com/search/repositories?q=user:${username}+sort:author-date-asc`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      let repos = res.data.items;
      let latestSixRepos = repos.splice(0, 6);
      let latestTwelveRepos = repos.splice(0, 12);
      return latestTwelveRepos;
    } else {
      const res = await axios.get<GitHubSearchResponse>(
        `https://api.github.com/search/repositories?q=user:${username}+sort:author-date-asc`
      );
      let repos = res.data.items;
      let latestTwelveRepos = repos.splice(0, 12);
      return latestTwelveRepos;
    }
  } catch (err) {
    console.log(err);
  }
};
