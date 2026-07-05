// Prisma-free GitHub types so client components can import them without pulling
// in the server-only github lib.

export interface GithubRepoSummary {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  license: string | null;
  default_branch: string;
  size: number;
}

export interface GithubRepoDetail extends GithubRepoSummary {
  languages: Record<string, number>;
  subscribers_count: number | null;
  network_count: number | null;
  readmeHtml: string | null;
}

// Admin-managed display settings, stored in SiteConfig (no DB migration).
export interface GithubRepoSettings {
  count: number; // how many repos to show publicly
  order: string[]; // repo names, in display order
  excluded: string[]; // repo names hidden from the public page
}

export const DEFAULT_REPO_SETTINGS: GithubRepoSettings = {
  count: 12,
  order: [],
  excluded: [],
};
