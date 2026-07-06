import type { NextApiResponse } from "next";
import { slugify } from "@/lib/utils";
import { getProjectSlugs } from "@/features/portfolio/lib/projects";

// Re-render the static project surfaces on demand after an admin mutation, so
// edits go live immediately instead of waiting for the time-based revalidate.
// Failures (e.g. a path not yet generated) are non-fatal — ISR still catches up.
export async function revalidateProjects(
  res: NextApiResponse,
  project?: { videoKey?: string; title?: string },
): Promise<void> {
  const paths = new Set<string>(["/", "/portfolio"]);
  // The project's public detail pages: the legacy video-key route and the
  // readable /portfolio/<slug> route.
  if (project?.videoKey) paths.add(`/project/${project.videoKey}`);
  if (project?.title) paths.add(`/portfolio/${slugify(project.title)}`);

  // Every project detail page embeds a "Similar projects" rail built from the
  // full project list, so a create/update/delete can change sibling pages too.
  // Revalidate all remaining project pages (this runs after the DB mutation, so
  // a deleted project is already gone from the slug list — its own page is
  // covered by the title path above and will 404 on regen).
  try {
    const slugs = await getProjectSlugs();
    for (const slug of slugs) paths.add(`/portfolio/${slug}`);
  } catch {
    // If the slug lookup fails, the core paths above still get revalidated.
  }

  await Promise.all(
    [...paths].map((path) => res.revalidate(path).catch(() => undefined)),
  );
}
