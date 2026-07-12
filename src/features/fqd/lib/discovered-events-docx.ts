import { Document, Packer, Paragraph, TextRun } from "docx";
import type { DiscoveredEvent } from "../types/fqd-types";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "Date TBD";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

function dateLine(e: DiscoveredEvent): string {
  if (!e.startDate) return "Date TBD";
  if (!e.endDate || e.endDate.slice(0, 10) === e.startDate.slice(0, 10)) {
    return fmtDate(e.startDate);
  }
  return `${fmtDate(e.startDate)} – ${fmtDate(e.endDate)}`;
}

// Sort by event date, most recent first, then older; events without a date
// sink to the bottom.
function sortRecentFirst(events: DiscoveredEvent[]): DiscoveredEvent[] {
  return [...events].sort((a, b) => {
    if (!a.startDate && !b.startDate) return 0;
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return b.startDate.localeCompare(a.startDate); // descending
  });
}

// Build a .docx listing the discovered events as a numbered list ordered from
// most recent event date to oldest.
export async function buildDiscoveredEventsDocx(
  events: DiscoveredEvent[],
): Promise<Buffer> {
  const sorted = sortRecentFirst(events);

  const children: Paragraph[] = [
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({ text: "New Orleans Events", bold: true, size: 32 }),
      ],
    }),
  ];

  sorted.forEach((e, i) => {
    children.push(
      new Paragraph({
        spacing: { before: i === 0 ? 0 : 200, after: 40 },
        children: [
          new TextRun({ text: `${i + 1}. ${e.title}`, bold: true, size: 26 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: dateLine(e), italics: true, size: 22 }),
        ],
      }),
    );

    const meta = [e.locationName, e.category].filter(Boolean).join(" · ");
    if (meta) {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: meta, size: 22 })],
        }),
      );
    }
    if (e.description) {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: e.description, size: 22 })],
        }),
      );
    }
  });

  const doc = new Document({ sections: [{ children }] });
  return Packer.toBuffer(doc);
}
