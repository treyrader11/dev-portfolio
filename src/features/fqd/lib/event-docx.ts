import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
} from "docx";
import type { FqdEventListItem } from "../types/fqd-types";
import { eventDateLabel } from "./format";

// A labeled field: a small purple label paragraph + the value, or nothing when
// the value is empty.
function field(label: string, value?: string | null): Paragraph[] {
  if (!value) return [];
  return [
    new Paragraph({
      spacing: { before: 160, after: 20 },
      children: [
        new TextRun({
          text: label.toUpperCase(),
          bold: true,
          size: 16,
          color: "9333EA",
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: value, size: 22 })] }),
  ];
}

// Build a .docx of the event's details, returned as a Buffer.
export async function buildEventDocx(
  event: FqdEventListItem,
): Promise<Buffer> {
  const location = [event.locationName, event.address]
    .filter(Boolean)
    .join(" · ");
  const category = event.category
    ? `${event.category}${event.subcategory ? ` / ${event.subcategory}` : ""}`
    : "";

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            children: [new TextRun({ text: event.title })],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: event.status.toUpperCase(),
                size: 16,
                color: "6B7280",
              }),
            ],
          }),
          ...field("When", eventDateLabel(event)),
          ...field("Location", location),
          ...field("Category", category),
          ...field("Description", event.description),
          ...field("Admission", event.admission),
          ...field("Tickets", event.ticketUrl),
          ...field("Organizer", event.organizer),
          ...field("Expected attendance", event.expectedAttendance),
          ...field("Age requirement", event.ageRequirement),
          ...field("Website", event.website),
          ...field("Notes", event.notes),
          ...field(
            "Images",
            event.images.length
              ? event.images.map((img) => img.url).join("\n")
              : null,
          ),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}
