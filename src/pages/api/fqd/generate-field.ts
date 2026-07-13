import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import {
  researchEventFieldWithFallback,
  researchEventDescriptionWithFallback,
  aiErrorResponse,
} from "@/features/fqd/lib/fqd-research";
import { parseFqdProvider } from "@/features/fqd/types/fqd-types";

export const config = { maxDuration: 60 };

// Fields that can be individually web-searched.
const ALLOWED = new Set([
  "startDate",
  "endDate",
  "startTime",
  "locationName",
  "address",
  "description",
  "admission",
  "website",
  "ticketUrl",
  "organizer",
  "expectedAttendance",
  "ageRequirement",
  "notes",
]);

interface Body {
  field?: string;
  title?: string;
  startDate?: string;
  locationName?: string;
  address?: string;
  category?: string;
  subcategory?: string;
  website?: string;
  provider?: string;
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

// AI web-search for a single event field, returning its value (or notFound).
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
  const field = body.field ?? "";
  if (!ALLOWED.has(field)) {
    return res.status(400).json({ error: "Unsupported field" });
  }
  if (!body.title?.trim()) {
    return res
      .status(400)
      .json({ error: "Add a title first so the search has something to go on" });
  }

  const query = buildQuery(body);
  const only = parseFqdProvider(body.provider);
  try {
    const raw =
      field === "description"
        ? (await researchEventDescriptionWithFallback(query, only)).data
        : (await researchEventFieldWithFallback(field, query, only)).data;

    const value = raw.trim();
    if (/^none$/i.test(value)) {
      return res.status(200).json({ value: null, notFound: true });
    }
    // Dates must be a real YYYY-MM-DD; otherwise treat as not found.
    if (field === "startDate" || field === "endDate") {
      const m = value.match(/\d{4}-\d{2}-\d{2}/);
      if (!m) return res.status(200).json({ value: null, notFound: true });
      return res.status(200).json({ value: m[0] });
    }
    return res.status(200).json({ value });
  } catch (err) {
    const { status, body } = aiErrorResponse(err, `Couldn't search for ${field}`);
    return res.status(status).json(body);
  }
}
