import type { NextApiRequest, NextApiResponse } from "next";
import {
  getUserData,
  resolveAvatarUrl,
} from "@/features/profile/lib/get-user-data";

// Public endpoint so the site header (a global client component) can show the
// current CMS avatar without every page having to thread it through props.
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = await getUserData();
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300",
  );
  return res.status(200).json({ url: resolveAvatarUrl(user) });
}
