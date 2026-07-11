import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { createFqdEvent } from "@/features/fqd/actions/create-event";
import { deleteFqdEventWithImages } from "@/features/fqd/lib/delete-with-images";
import { loadDuplicateIndex } from "@/features/fqd/lib/duplicates";
import { researchToFormValues } from "@/features/fqd/lib/research-to-form";
import { slugify } from "@/lib/utils";
import type { EventResearch } from "@/features/fqd/types/fqd-types";

type BulkItem = EventResearch & { replaceId?: string };

const dupeKey = (title: string, startDate: string) =>
  `${slugify(title)}::${startDate.slice(0, 10)}`;

export const config = {
  maxDuration: 60,
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

  const { events } = req.body as { events?: BulkItem[] };
  if (!Array.isArray(events) || events.length === 0) {
    return res.status(400).json({ error: "No events provided" });
  }

  // Keys already taken — existing events plus anything created earlier in this
  // same batch — so we never create a duplicate the caller didn't ask to
  // replace. Items flagged with replaceId delete-then-recreate.
  const index = await loadDuplicateIndex();
  const seen = new Set(index.map((r) => `${r.slugKey}::${r.day}`));

  let created = 0;
  let replaced = 0;
  let skipped = 0;

  for (const item of events) {
    const { replaceId, ...fields } = item;
    const values = researchToFormValues(fields);
    if (!values.title || !values.startDate) {
      skipped += 1;
      continue;
    }
    const key = dupeKey(values.title, values.startDate);

    if (replaceId) {
      await deleteFqdEventWithImages(replaceId);
      await createFqdEvent(values, fields);
      seen.add(key);
      replaced += 1;
      continue;
    }

    if (seen.has(key)) {
      skipped += 1;
      continue;
    }
    // Store the parsed fields as rawResearch for audit.
    await createFqdEvent(values, fields);
    seen.add(key);
    created += 1;
  }

  return res.status(201).json({ created, replaced, skipped });
}
