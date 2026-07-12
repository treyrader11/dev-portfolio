"use client";

import * as React from "react";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Tag,
  Users,
  Ticket,
  Globe,
  ExternalLink,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────
// Shape mirrors the fields from the FQD `EventDetailPage`, trimmed to what a
// card needs to render.

export type EventStatus =
  | "draft"
  | "scheduled"
  | "published"
  | "cancelled"
  | "completed";

export interface EventImage {
  id: string;
  url: string;
  alt?: string | null;
}

export interface EventData {
  id: string;
  slug: string;
  title: string;
  status: EventStatus;
  /** ISO date string, e.g. "2026-08-14". */
  startDate: string;
  /** ISO date string; omit for single-day events. */
  endDate?: string | null;
  /** Human-readable start time, e.g. "6:00 PM". */
  startTime?: string | null;
  locationName?: string | null;
  address?: string | null;
  category?: string | null;
  subcategory?: string | null;
  description?: string | null;
  admission?: string | null;
  ticketUrl?: string | null;
  organizer?: string | null;
  expectedAttendance?: number | null;
  ageRequirement?: string | null;
  website?: string | null;
  notes?: string | null;
  images: EventImage[];
}

// ─── Status badge config ──────────────────────────────────────────────────────

const STATUS_BADGE: Record<EventStatus, string> = {
  draft: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
  scheduled: "bg-sky-500/15 text-sky-600 dark:text-sky-300",
  published: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  cancelled: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
  completed: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
};

// ─── Placeholder data ─────────────────────────────────────────────────────────

const PLACEHOLDER_IMAGES = {
  mardiGrasParade:
    "https://images.unsplash.com/photo-1703145217874-47c91be335e0?w=800&auto=format&fit=crop&q=80",
  brassBandNight:
    "https://images.unsplash.com/photo-1525994886773-080587e161c2?w=800&auto=format&fit=crop&q=80",
  trombone:
    "https://images.unsplash.com/photo-1506647385858-14280cbf4438?w=800&auto=format&fit=crop&q=80",
};

export const PLACEHOLDER_EVENT: EventData = {
  id: "evt_001",
  slug: "french-quarter-jazz-heritage-festival",
  title: "French Quarter Jazz & Heritage Festival",
  status: "published",
  startDate: "2026-08-14",
  endDate: "2026-08-16",
  startTime: "6:00 PM",
  locationName: "Jackson Square",
  address: "701 Decatur St, New Orleans, LA",
  category: "Music",
  subcategory: "Jazz",
  description:
    "Three days of live jazz, brass bands, and local food vendors in the heart of the French Quarter. Bring the whole family for an unforgettable celebration of New Orleans culture.",
  admission: "Free · donations welcome",
  ticketUrl: "https://example.com/tickets",
  organizer: "French Quarter Direct",
  expectedAttendance: 4500,
  ageRequirement: "All ages",
  website: "https://example.com",
  notes: null,
  images: [
    {
      id: "img_1",
      url: PLACEHOLDER_IMAGES.mardiGrasParade,
      alt: "Mardi Gras parade",
    },
    {
      id: "img_2",
      url: PLACEHOLDER_IMAGES.brassBandNight,
      alt: "Brass band at night",
    },
    { id: "img_3", url: PLACEHOLDER_IMAGES.trombone, alt: "Trombone player" },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Treat date-only strings ("YYYY-MM-DD") as local time to avoid the UTC
// off-by-one that `new Date("2026-08-14")` otherwise introduces.
function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value;
  const parsed = new Date(iso);
  return isNaN(parsed.getTime()) ? null : parsed;
}

// "Aug 14, 2026" · "Aug 14–16, 2026" · "Aug 28 – Sep 2, 2026" ·
// "Dec 30, 2026 – Jan 2, 2027"
function formatEventDateRange(start: string, end?: string | null): string {
  const s = parseDate(start);
  if (!s) return "";
  const e = parseDate(end);

  const md: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const mdy: Intl.DateTimeFormatOptions = { ...md, year: "numeric" };

  if (!e || s.toDateString() === e.toDateString()) {
    return s.toLocaleDateString("en-US", mdy);
  }
  const sameYear = s.getFullYear() === e.getFullYear();
  const sameMonth = sameYear && s.getMonth() === e.getMonth();

  if (sameMonth) {
    return `${s.toLocaleDateString("en-US", md)}–${e.getDate()}, ${e.getFullYear()}`;
  }
  if (sameYear) {
    return `${s.toLocaleDateString("en-US", md)} – ${e.toLocaleDateString("en-US", md)}, ${e.getFullYear()}`;
  }
  return `${s.toLocaleDateString("en-US", mdy)} – ${e.toLocaleDateString("en-US", mdy)}`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

// Cross-dissolve interval between poster images, in milliseconds.
const DISSOLVE_MS = 2000;

function EventPoster({
  images,
  title,
}: {
  images: EventImage[];
  title: string;
}) {
  const [index, setIndex] = React.useState(0);
  const [failed, setFailed] = React.useState<Set<string>>(() => new Set());

  const slides = images.filter((img) => !!img?.url);

  // Advance to the next image on a fixed interval; the cross-fade itself is
  // handled by the CSS opacity transition below.
  React.useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, DISSOLVE_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
      {/* Fallback base — visible when there are no images or the active one fails. */}
      <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-neutral-800">
        <ImageIcon
          size={48}
          className="text-slate-400 opacity-70 dark:text-slate-500"
        />
      </div>

      {slides.map((img, i) => (
        <Image
          key={img.id ?? i}
          src={img.url}
          alt={img.alt ?? title}
          fill
          sizes="(max-width: 640px) 100vw, 360px"
          onError={() => setFailed((prev) => new Set(prev).add(img.url))}
          style={{ transitionDuration: `${DISSOLVE_MS}ms` }}
          className={cn(
            "object-cover transition-opacity ease-in-out",
            i === index && !failed.has(img.url) ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </div>
  );
}

function MetaRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  if (children === null || children === undefined || children === "")
    return null;
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
      <span className="text-slate-400 dark:text-slate-500">{icon}</span>
      <span className="min-w-0 truncate">{children}</span>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

interface EventCardProps {
  /** Defaults to placeholder data so `<EventCard />` renders standalone. */
  event?: EventData;
  className?: string;
  /** Fixed pixel width. Omit to let the card fill its grid column. */
  panelWidth?: number;
  onOpen?: (eventId: string) => void;
}

export function EventCard({
  event = PLACEHOLDER_EVENT,
  className,
  panelWidth,
  onOpen,
}: EventCardProps) {
  const dateLabel = formatEventDateRange(event.startDate, event.endDate);
  const location = [event.locationName, event.address]
    .filter(Boolean)
    .join(" · ");
  const categoryLabel = event.category
    ? event.subcategory
      ? `${event.category} · ${event.subcategory}`
      : event.category
    : null;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl dark:bg-neutral-900",
        onOpen && "cursor-pointer",
        className,
      )}
      style={{ width: panelWidth ?? undefined }}
      onClick={onOpen ? () => onOpen(event.id) : undefined}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onKeyDown={
        onOpen
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen(event.id);
              }
            }
          : undefined
      }
    >
      {/* ── Poster ── */}
      <div className="relative h-[190px] w-full overflow-hidden">
        <EventPoster images={event.images} title={event.title} />

        {/* Gradient scrim for legibility */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Status badge */}
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium capitalize backdrop-blur-sm",
            STATUS_BADGE[event.status] ?? STATUS_BADGE.draft,
          )}
        >
          {event.status}
        </span>

        {/* Image count */}
        {event.images.length > 1 && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <ImageIcon size={12} />
            {event.images.length}
          </span>
        )}

        {/* Title on poster */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3
            className="line-clamp-2 text-xl font-bold leading-snug text-white"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
          >
            {event.title}
          </h3>
        </div>
      </div>

      {/* ── Info section ── */}
      <div className="space-y-3 px-4 pb-4 pt-3">
        {/* Meta rows */}
        <div className="space-y-1.5">
          <MetaRow icon={<Calendar size={14} />}>
            {dateLabel}
            {event.startTime ? ` · ${event.startTime}` : ""}
          </MetaRow>
          <MetaRow icon={<MapPin size={14} />}>{location || null}</MetaRow>
          <MetaRow icon={<Tag size={14} />}>{categoryLabel}</MetaRow>
          {typeof event.expectedAttendance === "number" && (
            <MetaRow icon={<Users size={14} />}>
              {event.expectedAttendance.toLocaleString()} expected
            </MetaRow>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
            {event.description}
          </p>
        )}

        {/* Footer: admission + external links */}
        {(event.admission || event.ticketUrl || event.website) && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-neutral-800">
            {event.admission && (
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {event.admission}
              </span>
            )}
            <div className="flex items-center gap-3">
              {event.website && (
                <a
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Visit event website"
                  className="text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-white"
                >
                  <Globe size={16} />
                </a>
              )}
              {event.ticketUrl && (
                <a
                  href={event.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  <Ticket size={13} />
                  Tickets
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
