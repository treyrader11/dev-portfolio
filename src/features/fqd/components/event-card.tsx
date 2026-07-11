"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  RiDeleteBinLine,
  RiPencilLine,
  RiImageLine,
  RiMapPin2Line,
  RiCalendarLine,
  RiArrowDownSLine,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";
import { cn, resolveImageSrc } from "@/lib/utils";
import {
  FQD_STATUS_BADGE,
  type FqdEventListItem,
  type FqdStatus,
} from "../types/fqd-types";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Deterministic (UTC) date format so server and client render identically.
function fmt(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

const has = (v?: string | null): boolean => !!(v && v.trim());

interface Props {
  event: FqdEventListItem;
  onDelete: (event: FqdEventListItem) => void;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export function EventCard({
  event,
  onDelete,
  selected,
  onToggleSelect,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  // The card opens the details page; the pencil opens the edit form.
  const detailHref = `/admin/french-quarter-direct/event/${event.slug}`;
  const editHref = `/admin/french-quarter-direct/create-event/${event.id}`;
  const thumbnail = event.images[0]?.url;
  const status = event.status as FqdStatus;
  const sameDay =
    !event.endDate || event.endDate.slice(0, 10) === event.startDate.slice(0, 10);
  const dateLabel = sameDay
    ? fmt(event.startDate)
    : `${fmt(event.startDate)} – ${fmt(event.endDate as string)}`;

  // Field-completeness checklist shown in the accordion.
  const fields: { label: string; ok: boolean }[] = [
    { label: "Title", ok: has(event.title) },
    { label: "Slug", ok: has(event.slug) },
    { label: "Start date", ok: has(event.startDate) },
    { label: "End date", ok: has(event.endDate) },
    { label: "Start time", ok: has(event.startTime) },
    { label: "Location", ok: has(event.locationName) },
    { label: "Address", ok: has(event.address) },
    { label: "Description", ok: has(event.description) },
    { label: "Category", ok: has(event.category) },
    { label: "Subcategory", ok: has(event.subcategory) },
    { label: "Admission", ok: has(event.admission) },
    { label: "Ticket URL", ok: has(event.ticketUrl) },
    { label: "Organizer", ok: has(event.organizer) },
    { label: "Expected attendance", ok: has(event.expectedAttendance) },
    { label: "Age requirement", ok: has(event.ageRequirement) },
    { label: "Website", ok: has(event.website) },
    { label: "Notes", ok: has(event.notes) },
    { label: "Images", ok: event.images.length > 0 },
  ];
  const filled = fields.filter((f) => f.ok).length;

  return (
    <div
      className={cn(
        "rounded-lg border bg-dark-400 transition-colors",
        selected ? "border-secondary/60" : "border-dark-600",
      )}
    >
      <div className="flex items-start justify-between gap-3 p-4">
        {onToggleSelect && (
          <input
            type="checkbox"
            checked={!!selected}
            onChange={() => onToggleSelect(event.id)}
            aria-label={`Select ${event.title}`}
            className="mt-4 size-4 shrink-0 accent-secondary"
          />
        )}
        <Link
          href={detailHref}
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          {/* First image as a thumbnail so events are easy to identify. */}
          <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded border border-dark-600 bg-dark-600">
            {thumbnail ? (
              <Image
                src={resolveImageSrc(thumbnail)}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full items-center justify-center text-light-400">
                <RiImageLine className="size-5" />
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-medium text-white">{event.title}</h3>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                  FQD_STATUS_BADGE[status] ?? FQD_STATUS_BADGE.draft,
                )}
              >
                {status}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-light-400">
              <span className="inline-flex items-center gap-1">
                <RiCalendarLine className="size-3.5" />
                {dateLabel}
                {event.startTime ? ` · ${event.startTime}` : ""}
              </span>
              {event.locationName && (
                <span className="inline-flex items-center gap-1">
                  <RiMapPin2Line className="size-3.5" />
                  {event.locationName}
                </span>
              )}
              {event.category && (
                <span>
                  {event.category}
                  {event.subcategory ? ` / ${event.subcategory}` : ""}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-secondary">
                <RiImageLine className="size-3.5" />
                {event.images.length} image
                {event.images.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label={expanded ? "Hide fields" : "Show fields"}
            aria-expanded={expanded}
            onClick={() => setExpanded((e) => !e)}
            className="text-light-400 transition-colors hover:text-white"
          >
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="inline-flex"
            >
              <RiArrowDownSLine className="size-5" />
            </motion.span>
          </button>
          <Link
            href={editHref}
            aria-label="Edit event"
            className="text-light-400 transition-colors hover:text-white"
          >
            <RiPencilLine className="size-5" />
          </Link>
          <button
            type="button"
            aria-label="Delete event"
            onClick={() => onDelete(event)}
            className="text-error transition-colors hover:text-error-600"
          >
            <RiDeleteBinLine className="size-5" />
          </button>
        </div>
      </div>

      {/* Accordion — field completeness checklist. */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="fields"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-dark-600 px-4 py-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-light-400">
                Fields ({filled}/{fields.length})
              </p>
              <ul className="grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {fields.map((f) => (
                  <li
                    key={f.label}
                    className="flex items-center gap-2 text-sm"
                  >
                    {f.ok ? (
                      <RiCheckLine className="size-4 shrink-0 text-success" />
                    ) : (
                      <RiCloseLine className="size-4 shrink-0 text-error" />
                    )}
                    <span className={f.ok ? "text-white" : "text-light-400"}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
