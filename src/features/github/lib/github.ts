import { prisma } from "@/lib/prisma";
import {
  DEFAULT_REPO_SETTINGS,
  type GithubRepoSummary,
  type GithubRepoDetail,
  type GithubRepoSettings,
} from "../types";

// Re-export the types so existing server-side importers can pull them from here.
export {
  DEFAULT_REPO_SETTINGS,
  type GithubRepoSummary,
  type GithubRepoDetail,
  type GithubRepoSettings,
};

// ---- GitHub API ----------------------------------------------------------

function ghHeaders(token?: string, accept = "application/vnd.github+json") {
  const headers: Record<string, string> = {
    Accept: accept,
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

interface RawRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  license: { spdx_id?: string; name?: string } | null;
  default_branch: string;
  size: number;
  subscribers_count?: number;
  network_count?: number;
}

function normalizeRepo(r: RawRepo): GithubRepoSummary {
  return {
    id: r.id,
    name: r.name,
    full_name: r.full_name,
    description: r.description,
    html_url: r.html_url,
    homepage: r.homepage,
    language: r.language,
    topics: r.topics ?? [],
    stargazers_count: r.stargazers_count,
    forks_count: r.forks_count,
    watchers_count: r.watchers_count,
    open_issues_count: r.open_issues_count,
    created_at: r.created_at,
    updated_at: r.updated_at,
    pushed_at: r.pushed_at,
    fork: r.fork,
    archived: r.archived,
    license: r.license?.spdx_id && r.license.spdx_id !== "NOASSERTION"
      ? r.license.spdx_id
      : (r.license?.name ?? null),
    default_branch: r.default_branch,
    size: r.size,
  };
}

// Every public repo the user owns (up to 100, newest push first), with rich
// summary fields. Returns [] on any failure so callers stay resilient.
export async function fetchAllRepos(
  username: string,
  token?: string,
): Promise<GithubRepoSummary[]> {
  if (!username) return [];
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed&type=owner`,
      { headers: ghHeaders(token) },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as RawRepo[];
    return data.map(normalizeRepo);
  } catch (e) {
    console.error("fetchAllRepos failed:", e);
    return [];
  }
}

// Full detail for one repo: base repo + language breakdown + rendered README.
export async function fetchRepoDetail(
  username: string,
  name: string,
  token?: string,
): Promise<GithubRepoDetail | null> {
  if (!username || !name) return null;
  const base = `https://api.github.com/repos/${username}/${name}`;
  try {
    const repoRes = await fetch(base, { headers: ghHeaders(token) });
    if (!repoRes.ok) return null;
    const raw = (await repoRes.json()) as RawRepo;

    const [languages, readmeHtml] = await Promise.all([
      fetch(`${base}/languages`, { headers: ghHeaders(token) })
        .then((r) => (r.ok ? (r.json() as Promise<Record<string, number>>) : {}))
        .catch(() => ({})),
      // GitHub renders the README to HTML for us — avoids a markdown dep.
      fetch(`${base}/readme`, {
        headers: ghHeaders(token, "application/vnd.github.html+json"),
      })
        .then((r) => (r.ok ? r.text() : null))
        .catch(() => null),
    ]);

    return {
      ...normalizeRepo(raw),
      languages,
      subscribers_count: raw.subscribers_count ?? null,
      network_count: raw.network_count ?? null,
      readmeHtml,
    };
  } catch (e) {
    console.error("fetchRepoDetail failed:", e);
    return null;
  }
}

// ---- Settings (SiteConfig) ----------------------------------------------

export async function getRepoSettings(): Promise<GithubRepoSettings> {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { key: "githubRepos" },
    });
    if (config?.value) {
      const v = config.value as unknown as Partial<GithubRepoSettings>;
      return {
        count:
          typeof v.count === "number" && v.count > 0
            ? v.count
            : DEFAULT_REPO_SETTINGS.count,
        order: Array.isArray(v.order) ? v.order : [],
        excluded: Array.isArray(v.excluded) ? v.excluded : [],
      };
    }
  } catch (e) {
    console.error("getRepoSettings failed:", e);
  }
  return DEFAULT_REPO_SETTINGS;
}

// Apply admin settings to a repo list: drop excluded, sort by the saved order
// (ordered repos first, remaining by push date), then cap to `count`.
export function applyRepoSettings(
  repos: GithubRepoSummary[],
  settings: GithubRepoSettings,
): GithubRepoSummary[] {
  const excluded = new Set(settings.excluded);
  const orderIndex = new Map(settings.order.map((name, i) => [name, i]));
  const visible = repos.filter((r) => !excluded.has(r.name));
  visible.sort((a, b) => {
    const ai = orderIndex.has(a.name)
      ? (orderIndex.get(a.name) as number)
      : Infinity;
    const bi = orderIndex.has(b.name)
      ? (orderIndex.get(b.name) as number)
      : Infinity;
    if (ai !== bi) return ai - bi;
    return b.pushed_at.localeCompare(a.pushed_at);
  });
  return visible.slice(0, settings.count);
}

// Public-facing repo list for /portfolio: fetched + settings applied.
export async function getManagedRepos(
  username: string,
  token?: string,
): Promise<GithubRepoSummary[]> {
  const [repos, settings] = await Promise.all([
    fetchAllRepos(username, token),
    getRepoSettings(),
  ]);
  return applyRepoSettings(repos, settings);
}
