import type { NextApiResponse } from "next";
import { slugify } from "@/lib/utils";

// Re-render the static project surfaces on demand after an admin mutation, so
// edits go live immediately instead of waiting for the time-based revalidate.
// Failures (e.g. a path not yet generated) are non-fatal — ISR still catches up.
export async function revalidateProjects(
  res: NextApiResponse,
  project?: { videoKey?: string; title?: string },
): Promise<void> {
  const paths = ["/", "/portfolio"];
  // The project's public detail pages: the legacy video-key route and the
  // readable /portfolio/<slug> route.
  if (project?.videoKey) paths.push(`/project/${project.videoKey}`);
  if (project?.title) paths.push(`/portfolio/${slugify(project.title)}`);

  await Promise.all(
    paths.map((path) => res.revalidate(path).catch(() => undefined)),
  );
}
