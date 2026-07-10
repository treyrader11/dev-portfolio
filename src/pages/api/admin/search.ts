import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { getAllProjects } from "@/features/portfolio/lib/projects";
import { getManagedRepos } from "@/features/github/lib/github";
import { getUserData } from "@/features/profile/lib/get-user-data";
import { slugify } from "@/lib/utils";

export interface GlobalSearchResults {
  events: { id: string; title: string; subtitle: string; href: string }[];
  projects: { title: string; subtitle: string; href: string }[];
  repos: { name: string; subtitle: string; href: string }[];
}

const EMPTY: GlobalSearchResults = { events: [], projects: [], repos: [] };
const LIMIT = 6;

// Don't let a slow GitHub fetch hold up the whole search.
function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    p.catch(() => fallback),
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;

  const q = String(req.query.q ?? "").trim();
  if (q.length < 2) return res.status(200).json(EMPTY);
  const lower = q.toLowerCase();

  // Events — by title or location (name/address).
  const eventsQuery = prisma.fqdEvent
    .findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { locationName: { contains: q, mode: "insensitive" } },
          { address: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: { startDate: "asc" },
      take: LIMIT,
      select: { id: true, title: true, locationName: true },
    })
    .then((rows) =>
      rows.map((e) => ({
        id: e.id,
        title: e.title,
        subtitle: e.locationName ?? "",
        href: `/admin/french-quarter-direct/events/${e.id}`,
      })),
    );

  // Projects — by title, stack, tags, or technology feature (JS filter so array
  // fields like "MongoDB" in technology_feature match case-insensitively).
  const projectsQuery = getAllProjects().then((all) =>
    all
      .filter((p) => {
        const hay = [
          p.title,
          p.stack,
          ...(p.tags ?? []),
          ...(p.technology_feature ?? []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(lower);
      })
      .slice(0, LIMIT)
      .map((p) => ({
        title: p.title,
        subtitle:
          p.stack || (p.technology_feature ?? []).slice(0, 3).join(", ") || "",
        href: `/admin/projects/${slugify(p.title)}`,
      })),
  );

  // GitHub repos — show all when the query mentions "github", otherwise match by
  // repo name. Wrapped in a timeout so a slow GitHub call never stalls search.
  const reposQuery = (async () => {
    const token = process.env.GITHUB_AUTH_TOKEN;
    const { githubUsername } = await getUserData();
    const managed = await getManagedRepos(githubUsername, token);
    const wantsAll = lower.includes("github");
    return managed
      .filter((r) => wantsAll || r.name.toLowerCase().includes(lower))
      .slice(0, LIMIT)
      .map((r) => ({
        name: r.name,
        subtitle: r.language ?? r.description ?? "",
        href: `/portfolio/repo/${r.name}`,
      }));
  })();

  const [events, projects, repos] = await Promise.all([
    eventsQuery,
    projectsQuery,
    withTimeout(reposQuery, 3000, [] as GlobalSearchResults["repos"]),
  ]);

  return res.status(200).json({ events, projects, repos });
}
