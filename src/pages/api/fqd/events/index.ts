import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { getFqdEvents } from "@/features/fqd/actions/get-events";
import { createFqdEvent } from "@/features/fqd/actions/create-event";
import { findDuplicateEvent } from "@/features/fqd/lib/duplicates";
import { deleteFqdEventWithImages } from "@/features/fqd/lib/delete-with-images";
import type { FqdEventFormValues } from "@/features/fqd/types/fqd-types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;

  if (req.method === "GET") {
    const page = Number(req.query.page ?? 1) || 1;
    const pageSize = Number(req.query.pageSize ?? 20) || 20;
    const missing =
      typeof req.query.missing === "string" ? req.query.missing : undefined;
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;
    const added =
      typeof req.query.added === "string" ? req.query.added : undefined;
    const newOnly =
      typeof req.query.new === "string" ? req.query.new : undefined;
    const offsetNum =
      typeof req.query.offset === "string" && req.query.offset !== ""
        ? Number(req.query.offset)
        : undefined;
    const offset =
      offsetNum != null && Number.isFinite(offsetNum) ? offsetNum : undefined;
    try {
      const data = await getFqdEvents(
        page,
        pageSize,
        missing,
        search,
        added,
        newOnly,
        offset,
      );
      return res.status(200).json(data);
    } catch (err) {
      console.error("[fqd] events GET failed:", err);
      return res.status(500).json({ error: "Failed to load events" });
    }
  }

  if (req.method === "POST") {
    const { rawResearch, replaceId, ...values } = req.body as FqdEventFormValues & {
      rawResearch?: unknown;
      replaceId?: string;
    };
    if (!values.title?.trim() || !values.startDate) {
      return res
        .status(400)
        .json({ error: "Title and start date are required" });
    }
    // Replacing an existing event: delete it (and its Cloudinary images) first,
    // freeing its slug, then create the new one in its place.
    if (replaceId) {
      await deleteFqdEventWithImages(replaceId);
    } else {
      const duplicate = await findDuplicateEvent(values.title, values.startDate);
      if (duplicate) return res.status(409).json({ duplicate });
    }
    const event = await createFqdEvent(values, rawResearch);
    return res.status(201).json(event);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method not allowed" });
}
