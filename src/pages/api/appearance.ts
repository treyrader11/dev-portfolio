import type { NextApiRequest, NextApiResponse } from "next";
import { getAppearance } from "@/lib/db/content";

// Public read-only endpoint for the background-noise appearance config, consumed
// client-side by the AppearanceProvider so the global footer and page headers
// can react to CMS changes without threading props through every page.
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  const appearance = await getAppearance();
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  res.json(appearance);
}
