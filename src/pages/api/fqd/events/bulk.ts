import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { createFqdEvent } from "@/features/fqd/actions/create-event";
import { researchToFormValues } from "@/features/fqd/lib/research-to-form";
import type { EventResearch } from "@/features/fqd/types/fqd-types";

export const config = {
  api: { bodyParser: { sizeLimit: "4mb" } },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { events } = req.body as { events?: EventResearch[] };
  if (!Array.isArray(events) || events.length === 0) {
    return res.status(400).json({ error: "No events provided" });
  }

  let created = 0;
  for (const fields of events) {
    const values = researchToFormValues(fields);
    if (!values.title || !values.startDate) continue; // skip incomplete
    // Store the parsed fields as rawResearch for audit.
    await createFqdEvent(values, fields);
    created += 1;
  }

  return res.status(201).json({ created });
}
