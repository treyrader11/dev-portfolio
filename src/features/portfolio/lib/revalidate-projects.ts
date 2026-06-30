import type { NextApiResponse } from "next";

// Re-render the static project surfaces on demand after an admin mutation, so
// edits go live immediately instead of waiting for the time-based revalidate.
// Failures (e.g. a path not yet generated) are non-fatal — ISR still catches up.
export async function revalidateProjects(
  res: NextApiResponse,
  videoKey?: string,
): Promise<void> {
  const paths = ["/", "/portfolio"];
  if (videoKey) paths.push(`/project/${videoKey}`);

  await Promise.all(
    paths.map((path) => res.revalidate(path).catch(() => undefined)),
  );
}
