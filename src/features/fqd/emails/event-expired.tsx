import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
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

interface Props {
  event: FqdEventListItem;
}

export function EventExpiredEmail({ event }: Props): React.ReactElement {
  const location = [event.locationName, event.address].filter(Boolean).join(" · ");
  const category = event.category
    ? `${event.category}${event.subcategory ? ` / ${event.subcategory}` : ""}`
    : "";

  const rows: { label: string; value?: string | null; href?: boolean }[] = [
    { label: "When", value: dateLabel(event) },
    { label: "Location", value: location || null },
    { label: "Category", value: category || null },
    { label: "Description", value: event.description },
    { label: "Admission", value: event.admission },
    { label: "Tickets", value: event.ticketUrl, href: true },
    { label: "Organizer", value: event.organizer },
    { label: "Expected attendance", value: event.expectedAttendance },
    { label: "Age requirement", value: event.ageRequirement },
    { label: "Website", value: event.website, href: true },
    { label: "Notes", value: event.notes },
  ].filter((r) => r.value && String(r.value).trim());

  return (
    <Html>
      <Head />
      <Preview>{event.title} has expired and was removed from the database</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={eyebrow}>FRENCH QUARTER DIRECT</Text>
            <Heading style={h1}>Event expired &amp; removed</Heading>
          </Section>

          <Section style={card}>
            <Text style={intro}>
              This event has passed its end date and was automatically removed
              from the database — including its {event.images.length} image
              {event.images.length === 1 ? "" : "s"} on Cloudinary. Its details
              are preserved below for your records.
            </Text>

            <Heading style={h2}>{event.title}</Heading>
            <span style={badge}>Expired · Removed</span>

            <Hr style={hr} />

            {rows.map((r) => (
              <Row key={r.label} style={row}>
                <Column style={labelCol}>{r.label}</Column>
                <Column style={valueCol}>
                  {r.href ? (
                    <Link href={r.value as string} style={link}>
                      {r.value}
                    </Link>
                  ) : (
                    r.value
                  )}
                </Column>
              </Row>
            ))}

            <Hr style={hr} />
            <Text style={footer}>
              Automated message from your Dev Portfolio admin CMS.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default EventExpiredEmail;

const main: React.CSSProperties = {
  backgroundColor: "#0f0f0f",
  margin: "0 auto",
  padding: "32px 0",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

const container: React.CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto",
  borderRadius: "14px",
  overflow: "hidden",
  border: "1px solid #26262b",
};

const header: React.CSSProperties = {
  background: "linear-gradient(135deg, #9333ea 0%, #6d28d9 100%)",
  padding: "28px 32px",
};

const eyebrow: React.CSSProperties = {
  margin: "0 0 6px",
  color: "rgba(255,255,255,0.75)",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "2px",
};

const h1: React.CSSProperties = {
  margin: 0,
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: 700,
};

const card: React.CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "28px 32px",
};

const intro: React.CSSProperties = {
  margin: "0 0 20px",
  color: "#4b5563",
  fontSize: "14px",
  lineHeight: "22px",
};

const h2: React.CSSProperties = {
  margin: "0 0 10px",
  color: "#111827",
  fontSize: "20px",
  fontWeight: 700,
};

const badge: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#f3e8ff",
  color: "#7e22ce",
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  padding: "4px 10px",
  borderRadius: "9999px",
};

const hr: React.CSSProperties = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
};

const row: React.CSSProperties = {
  marginBottom: "12px",
};

const labelCol: React.CSSProperties = {
  width: "150px",
  verticalAlign: "top",
  color: "#9333ea",
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  paddingBottom: "12px",
  paddingRight: "12px",
};

const valueCol: React.CSSProperties = {
  verticalAlign: "top",
  color: "#1f2937",
  fontSize: "14px",
  lineHeight: "21px",
  paddingBottom: "12px",
};

const link: React.CSSProperties = {
  color: "#7c3aed",
  textDecoration: "underline",
  wordBreak: "break-all",
};

const footer: React.CSSProperties = {
  margin: 0,
  color: "#9ca3af",
  fontSize: "12px",
};
