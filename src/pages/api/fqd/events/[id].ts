import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { getFqdEvent } from "@/features/fqd/actions/get-event";
import { updateFqdEvent } from "@/features/fqd/actions/update-event";
import { deleteFqdEvent } from "@/features/fqd/actions/delete-event";
import type { FqdEventFormValues } from "@/features/fqd/types/fqd-types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  const id = req.query.id as string;

  // Export sub-route: /api/fqd/events/[id]?export=pdf | docx — streams a
  // generated file as a download.
  if (req.method === "GET" && typeof req.query.export === "string") {
    const event = await getFqdEvent(id);
    if (!event) return res.status(404).json({ error: "Not found" });
    const filename = event.slug || "event";

    if (req.query.export === "docx") {
      const { buildEventDocx } = await import("@/features/fqd/lib/event-docx");
      const buffer = await buildEventDocx(event);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}.docx"`,
      );
      return res.send(buffer);
    }

    // Default: PDF via react-pdf (dynamic import so it isn't loaded on every
    // request).
    const { renderToBuffer } = await import("@react-pdf/renderer");
    const { EventPDF } = await import("@/features/fqd/lib/event-pdf");
    const { createElement } = await import("react");
    const buffer = await renderToBuffer(
      createElement(EventPDF, { event }) as unknown as Parameters<
        typeof renderToBuffer
      >[0],
    );
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}.pdf"`,
    );
    return res.send(buffer);
  }

  if (req.method === "GET") {
    const event = await getFqdEvent(id);
    if (!event) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(event);
  }

  if (req.method === "PUT") {
    const { rawResearch, ...values } = req.body as FqdEventFormValues & {
      rawResearch?: unknown;
    };
    if (!values.title?.trim() || !values.startDate) {
      return res
        .status(400)
        .json({ error: "Title and start date are required" });
    }
    const event = await updateFqdEvent(id, values, rawResearch);
    return res.status(200).json(event);
  }

  if (req.method === "DELETE") {
    await deleteFqdEvent(id);
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ error: "Method not allowed" });
}
