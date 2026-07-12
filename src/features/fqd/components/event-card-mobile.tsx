"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  RiCalendarLine,
  RiMapPin2Line,
  RiPriceTag3Line,
  RiGroupLine,
  RiTicket2Line,
  RiGlobalLine,
  RiExternalLinkLine,
  RiImageLine,
  RiPencilLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import { cn, resolveImageSrc } from "@/lib/utils";
import { FqdAddIcon } from "@/components/icons/FqdAddIcon";
import { FqdRemoveIcon } from "@/components/icons/FqdRemoveIcon";
import { EventStatusChips } from "./event-status-chips";
import { type FqdEventListItem } from "../types/fqd-types";

type EventImage = { id: string; url: string; alt?: string | null };

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Take the calendar date out of an ISO string and treat it as local midnight so
// the displayed day never shifts by a timezone.
function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  const m = value.match(/^\d{4}-\d{2}-\d{2}/);
  const parsed = new Date(m ? `${m[0]}T00:00:00` : value);
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
  className,
}: {
  images: EventImage[];
  title: string;
  className?: string;
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
    <div
      className={cn(
        "absolute inset-0 transition-transform duration-500 group-hover:scale-105",
        className,
      )}
    >
      {/* Fallback base — visible when there are no images or the active one fails. */}
      <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
        <RiImageLine className="size-12 text-neutral-500 opacity-70" />
      </div>

      {slides.map((img, i) => (
        <Image
          key={img.id ?? i}
          src={resolveImageSrc(img.url)}
          alt={img.alt ?? title}
          fill
          sizes="(max-width: 768px) 100vw, 360px"
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
    <div className="flex items-center gap-2 text-sm text-slate-300">
      <span className="shrink-0 text-slate-500">{icon}</span>
      <span className="min-w-0 truncate">{children}</span>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

interface Props {
  event: FqdEventListItem;
  onDelete: (event: FqdEventListItem) => void;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  onToggleAdded?: (event: FqdEventListItem) => void;
}

export function EventCardMobile({
  event,
  onDelete,
  selected,
  onToggleSelect,
  onToggleAdded,
}: Props) {
  const detailHref = `/admin/french-quarter-direct/event/${event.slug}`;
  const editHref = `/admin/french-quarter-direct/create-event/${event.id}`;
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
        "group flex flex-col overflow-hidden rounded-3xl border bg-neutral-900 shadow-lg transition-colors",
        "w-full",
        selected
          ? "border-secondary/60"
          : event.addedToJoomla
            ? "border-lime-400/40"
            : "border-neutral-800",
      )}
    >
      {/* ── Poster (full-bleed, above the body) ── */}
      <Link href={detailHref} className={cn("w-full")}>
        <div className="relative h-[190px] w-full overflow-hidden">
          <EventPoster
            images={event.images}
            title={event.title}
            className={cn("")}
          />

          {/* Gradient scrim for legibility */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.55) 100%)",
            }}
          />

          {/* Provenance + status badges (AI Scraped / Researched / …) */}
          <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
            <EventStatusChips event={event} chipClassName="backdrop-blur-sm" />
          </div>

          {/* Image count + added badge */}
          <div className="absolute right-3 top-3 flex items-center gap-2">
            {event.images.length > 1 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <RiImageLine className="size-3" />
                {event.images.length}
              </span>
            )}
            {event.addedToJoomla && (
              <span className="rounded-full bg-lime-400 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-black shadow-lg">
                Added
              </span>
            )}
          </div>

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
      </Link>

      {/* ── Info section ── */}
      <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-3">
        {/* Meta rows */}
        <div className="space-y-1.5">
          <MetaRow icon={<RiCalendarLine className="size-3.5" />}>
            {dateLabel}
            {event.startTime ? ` · ${event.startTime}` : ""}
          </MetaRow>
          <MetaRow icon={<RiMapPin2Line className="size-3.5" />}>
            {location || null}
          </MetaRow>
          <MetaRow icon={<RiPriceTag3Line className="size-3.5" />}>
            {categoryLabel}
          </MetaRow>
          {event.expectedAttendance && (
            <MetaRow icon={<RiGroupLine className="size-3.5" />}>
              {event.expectedAttendance}
            </MetaRow>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p className="line-clamp-2 text-sm text-slate-400">
            {event.description}
          </p>
        )}

        {/* Footer: admission + external links */}
        {(event.admission || event.ticketUrl || event.website) && (
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-neutral-800 pt-3">
            {event.admission ? (
              <span className="truncate text-sm font-medium text-white">
                {event.admission}
              </span>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-3">
              {event.website && (
                <a
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit event website"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <RiGlobalLine className="size-4" />
                </a>
              )}
              {event.ticketUrl && (
                <a
                  href={event.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-200"
                >
                  <RiTicket2Line className="size-3.5" />
                  Tickets
                  <RiExternalLinkLine className="size-3" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Admin actions */}
        <div className="flex items-center justify-between gap-2 border-t border-neutral-800 pt-3">
          {onToggleSelect ? (
            <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-slate-400">
              <input
                type="checkbox"
                checked={!!selected}
                onChange={() => onToggleSelect(event.id)}
                className="size-4 accent-secondary"
              />
              Select
            </label>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-4">
            {onToggleAdded && (
              <button
                type="button"
                aria-label={
                  event.addedToJoomla
                    ? "Mark as not added to French Quarter Direct"
                    : "Mark as added to French Quarter Direct"
                }
                title={
                  event.addedToJoomla
                    ? "Added — click to unmark"
                    : "Mark as added to French Quarter Direct"
                }
                onClick={() => onToggleAdded(event)}
                className={cn(
                  "transition-colors",
                  event.addedToJoomla
                    ? "text-lime-400 hover:text-lime-300"
                    : "text-slate-400 hover:text-white",
                )}
              >
                {event.addedToJoomla ? (
                  <FqdRemoveIcon size={20} />
                ) : (
                  <FqdAddIcon size={20} />
                )}
              </button>
            )}
            <Link
              href={editHref}
              aria-label="Edit event"
              className="text-slate-400 transition-colors hover:text-white"
            >
              <RiPencilLine className="size-5" />
            </Link>
            <button
              type="button"
              aria-label="Delete event"
              onClick={() => onDelete(event)}
              className="text-rose-400 transition-colors hover:text-rose-300"
            >
              <RiDeleteBinLine className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// A loading placeholder matching the tile's shape.
export function EventCardMobileSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900">
      <div className="h-[190px] w-full animate-pulse bg-neutral-800" />
      <div className="space-y-3 px-4 pb-4 pt-3">
        <div className="h-3 w-3/4 animate-pulse rounded bg-neutral-800" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-800" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-800" />
        <div className="mt-2 flex gap-3 border-t border-neutral-800 pt-3">
          <div className="size-5 animate-pulse rounded-full bg-neutral-800" />
          <div className="size-5 animate-pulse rounded-full bg-neutral-800" />
          <div className="size-5 animate-pulse rounded-full bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}
