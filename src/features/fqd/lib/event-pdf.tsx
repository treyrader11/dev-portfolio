import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { FqdEventListItem } from "../types/fqd-types";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function fmt(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

function dateLabel(event: FqdEventListItem): string {
  const sameDay =
    !event.endDate || event.endDate.slice(0, 10) === event.startDate.slice(0, 10);
  const base = sameDay
    ? fmt(event.startDate)
    : `${fmt(event.startDate)} – ${fmt(event.endDate as string)}`;
  return event.startTime ? `${base} · ${event.startTime}` : base;
}

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 11, color: "#1f2937", lineHeight: 1.5 },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 4, color: "#111827" },
  status: { fontSize: 9, color: "#6b7280", textTransform: "uppercase", marginBottom: 18 },
  row: { marginBottom: 12 },
  label: {
    fontSize: 8,
    color: "#9333ea",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  value: { fontSize: 11, color: "#1f2937" },
});

interface Props {
  event: FqdEventListItem;
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

// react-pdf document for an event's details.
export function EventPDF({ event }: Props) {
  const location = [event.locationName, event.address].filter(Boolean).join(" · ");
  const category = event.category
    ? `${event.category}${event.subcategory ? ` / ${event.subcategory}` : ""}`
    : "";

  return (
    <Document title={event.title}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.status}>{event.status}</Text>

        <Field label="When" value={dateLabel(event)} />
        <Field label="Location" value={location} />
        <Field label="Category" value={category} />
        <Field label="Description" value={event.description} />
        <Field label="Admission" value={event.admission} />
        <Field label="Tickets" value={event.ticketUrl} />
        <Field label="Organizer" value={event.organizer} />
        <Field label="Expected attendance" value={event.expectedAttendance} />
        <Field label="Age requirement" value={event.ageRequirement} />
        <Field label="Website" value={event.website} />
        <Field label="Notes" value={event.notes} />
        {event.images.length > 0 && (
          <Field
            label="Images"
            value={event.images.map((img) => img.url).join("\n")}
          />
        )}
      </Page>
    </Document>
  );
}
