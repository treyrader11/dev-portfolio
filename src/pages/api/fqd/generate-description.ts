import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import {
  researchEventDescriptionWithFallback,
  FqdAllProvidersError,
} from "@/features/fqd/lib/fqd-research";

export const config = { maxDuration: 60 };

interface Body {
  title?: string;
  locationName?: string;
  address?: string;
  startDate?: string;
  category?: string;
  subcategory?: string;
  website?: string;
}

function buildQuery(b: Body): string {
  const year = b.startDate ? b.startDate.slice(0, 4) : "";
  return [
    b.title,
    year,
    b.locationName,
    b.address,
    b.category,
    b.subcategory,
    b.website ? `official site ${b.website}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

// AI web-search for a factual event description from the event's current
// details.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body as Body;
  if (!body.title?.trim()) {
    return res
      .status(400)
      .json({ error: "Add a title first so the search has something to go on" });
  }

  try {
    const { data, provider } = await researchEventDescriptionWithFallback(
      buildQuery(body),
    );
    return res.status(200).json({ description: data, provider });
  } catch (err) {
    if (err instanceof FqdAllProvidersError) {
      return res
        .status(502)
        .json({ error: "AI providers unavailable", attempts: err.attempts });
    }
    return res.status(500).json({ error: "Couldn't generate a description" });
  }
}
