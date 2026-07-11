import { Document, Packer, Paragraph, TextRun } from "docx";
import { eventImageFilename } from "./image-filenames";
import type { FqdEventListItem } from "../types/fqd-types";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function fmt(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

// "July 19–24, 2026" when start/end share a month/year; otherwise the full
// range; a single date when there's no end.
function dateLine(event: FqdEventListItem): string {
  if (!event.endDate || event.endDate.slice(0, 10) === event.startDate.slice(0, 10)) {
    return fmt(event.startDate);
  }
  const s = new Date(event.startDate);
  const e = new Date(event.endDate);
  if (
    s.getUTCFullYear() === e.getUTCFullYear() &&
    s.getUTCMonth() === e.getUTCMonth()
  ) {
    return `${MONTHS[s.getUTCMonth()]} ${s.getUTCDate()}–${e.getUTCDate()}, ${e.getUTCFullYear()}`;
  }
  return `${fmt(event.startDate)} – ${fmt(event.endDate)}`;
}

// A "Label: value" line, or nothing when the value is empty.
function line(label: string, value?: string | null): Paragraph[] {
  if (!value || !value.trim()) return [];
  return [
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: `${label}: `, bold: true, size: 22 }),
        new TextRun({ text: value.trim(), size: 22 }),
      ],
    }),
  ];
}

// Build the formatted event "listing" .docx (title, date, then labeled lines in
// a fixed order), returned as a Buffer. Empty fields are skipped.
export async function buildEventListingDocx(
  event: FqdEventListItem,
): Promise<Buffer> {
  const location = [event.locationName, event.address]
    .filter(Boolean)
    .join(", ");
  const category = event.category
    ? `${event.category}${event.subcategory ? ` / ${event.subcategory}` : ""}`
    : "";
  // "Age Requirement: 21+ | Expected Attendance: 5,000" on one line when both
  // are present, otherwise whichever exists.
  const ageAttendance = [
    event.ageRequirement ? `Age Requirement: ${event.ageRequirement}` : null,
    event.expectedAttendance
      ? `Expected Attendance: ${event.expectedAttendance}`
      : null,
  ]
    .filter(Boolean)
    .join(" | ");

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: event.title, bold: true, size: 36 }),
            ],
          }),
          new Paragraph({
            spacing: { after: 160 },
            children: [
              new TextRun({ text: dateLine(event), italics: true, size: 24 }),
            ],
          }),
          ...line("Location", location),
          ...line("Time", event.startTime),
          ...line("Description", event.description),
          ...line("Tickets", event.admission),
          ...line("Ticket Link", event.ticketUrl),
          ...(ageAttendance
            ? [
                new Paragraph({
                  spacing: { after: 80 },
                  children: [
                    new TextRun({ text: ageAttendance, size: 22 }),
                  ],
                }),
              ]
            : []),
          ...line("Organizer", event.organizer),
          ...line("Website", event.website),
          ...line("Category", category),
          ...line("Notes", event.notes),
          ...imagesSection(event),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}

// A section listing each image's PNG filename and its alt text, so the alt text
// travels with the exported zip.
function imagesSection(event: FqdEventListItem): Paragraph[] {
  const total = event.images.length;
  if (total === 0) return [];
  const heading = new Paragraph({
    spacing: { before: 160, after: 40 },
    children: [
      new TextRun({ text: "Images", bold: true, size: 24 }),
    ],
  });
  const rows = event.images.map((img, i) => {
    const filename = eventImageFilename(event.slug, i, total);
    const alt = img.alt?.trim();
    return new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: `${filename}`, bold: true, size: 20 }),
        new TextRun({
          text: alt ? ` — alt: ${alt}` : " — alt: (none)",
          size: 20,
        }),
      ],
    });
  });
  return [heading, ...rows];
}
