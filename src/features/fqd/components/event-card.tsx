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
  RiCheckboxCircleFill,
  RiCheckboxBlankCircleLine,
} from "react-icons/ri";
import { cn, hasText, resolveImageSrc } from "@/lib/utils";
import { eventDateRange } from "../lib/format";
import {
  FQD_STATUS_BADGE,
  type FqdEventListItem,
  type FqdStatus,
} from "../types/fqd-types";

interface Props {
  event: FqdEventListItem;
  onDelete: (event: FqdEventListItem) => void;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  onToggleAdded?: (event: FqdEventListItem) => void;
}

export function EventCard({
  event,
  onDelete,
  selected,
  onToggleSelect,
  onToggleAdded,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const detailHref = `/admin/french-quarter-direct/event/${event.slug}`;
  const editHref = `/admin/french-quarter-direct/create-event/${event.id}`;
  const thumbnail = event.images[0]?.url;
  const status = event.status as FqdStatus;
  const dateLabel = eventDateRange(event.startDate, event.endDate);

  // Field-completeness checklist shown in the accordion.
  const fields: { label: string; ok: boolean }[] = [
    { label: "Title", ok: hasText(event.title) },
    { label: "Slug", ok: hasText(event.slug) },
    { label: "Start date", ok: hasText(event.startDate) },
    { label: "End date", ok: hasText(event.endDate) },
    { label: "Start time", ok: hasText(event.startTime) },
    { label: "Location", ok: hasText(event.locationName) },
    { label: "Address", ok: hasText(event.address) },
    { label: "Description", ok: hasText(event.description) },
    { label: "Category", ok: hasText(event.category) },
    { label: "Subcategory", ok: hasText(event.subcategory) },
    { label: "Admission", ok: hasText(event.admission) },
    { label: "Ticket URL", ok: hasText(event.ticketUrl) },
    { label: "Organizer", ok: hasText(event.organizer) },
    { label: "Expected attendance", ok: hasText(event.expectedAttendance) },
    { label: "Age requirement", ok: hasText(event.ageRequirement) },
    { label: "Website", ok: hasText(event.website) },
    { label: "Notes", ok: hasText(event.notes) },
    { label: "Images", ok: event.images.length > 0 },
  ];
  const filled = fields.filter((f) => f.ok).length;

  const metaRow = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-light-400">
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
        {event.images.length} image{event.images.length === 1 ? "" : "s"}
      </span>
    </div>
  );

  const chevron = (
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
  );

  const addedToggle = onToggleAdded && (
    <button
      type="button"
      aria-label={
        event.addedToJoomla
          ? "Mark as not added to French Quarter Direct"
          : "Mark as added to French Quarter Direct"
      }
      title={
        event.addedToJoomla
          ? "Added to French Quarter Direct — click to unmark"
          : "Mark as added to French Quarter Direct"
      }
      onClick={() => onToggleAdded(event)}
      className={cn(
        "transition-colors",
        event.addedToJoomla
          ? "text-lime-400 hover:text-lime-300"
          : "text-light-400 hover:text-white",
      )}
    >
      {event.addedToJoomla ? (
        <RiCheckboxCircleFill className="size-5" />
      ) : (
        <RiCheckboxBlankCircleLine className="size-5" />
      )}
    </button>
  );

  const editLink = (
    <Link
      href={editHref}
      aria-label="Edit event"
      className="text-light-400 transition-colors hover:text-white"
    >
      <RiPencilLine className="size-5" />
    </Link>
  );

  const deleteButton = (
    <button
      type="button"
      aria-label="Delete event"
      onClick={() => onDelete(event)}
      className="text-error transition-colors hover:text-error-600"
    >
      <RiDeleteBinLine className="size-5" />
    </button>
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-dark-400 transition-colors sm:rounded-lg",
        selected
          ? "border-secondary/60"
          : event.addedToJoomla
            ? "border-lime-400/40"
            : "border-dark-600",
      )}
    >
      {/* ── Mobile: image on top, content below ── */}
      <div className="relative sm:hidden">
        {/* Image */}
        <Link href={detailHref} className="block">
          <div className="relative h-48 w-full overflow-hidden bg-dark-600">
            {thumbnail ? (
              <Image
                src={resolveImageSrc(thumbnail)}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full items-center justify-center text-light-400">
                <RiImageLine className="size-12 opacity-60" />
              </span>
            )}
          </div>
        </Link>

        {/* Selection checkbox — over the image, outside the link. */}
        {onToggleSelect && (
          <button
            type="button"
            onClick={() => onToggleSelect(event.id)}
            aria-label={`Select ${event.title}`}
            className="absolute left-3 top-3 rounded-full bg-black/50 p-1 backdrop-blur-sm"
          >
            {selected ? (
              <RiCheckboxCircleFill className="size-5 text-secondary" />
            ) : (
              <RiCheckboxBlankCircleLine className="size-5 text-white" />
            )}
          </button>
        )}

        {/* Added badge — bright, over the image, top-right. */}
        {event.addedToJoomla && (
          <span className="absolute right-3 top-3 rounded-full bg-lime-400 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-black shadow-lg">
            Added
          </span>
        )}

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <Link href={detailHref} className="min-w-0">
              <h3 className="text-lg font-semibold text-white">
                {event.title}
              </h3>
            </Link>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                FQD_STATUS_BADGE[status] ?? FQD_STATUS_BADGE.draft,
              )}
            >
              {status}
            </span>
          </div>

          <div className="mt-2">{metaRow}</div>

          <div className="mt-4 flex items-center justify-between border-t border-dark-600 pt-3">
            <div className="flex items-center gap-4">
              {addedToggle}
              {editLink}
              {deleteButton}
            </div>
            {chevron}
          </div>
        </div>
      </div>

      {/* ── Desktop: compact row ── */}
      <div className="hidden items-start justify-between gap-3 p-4 sm:flex">
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
              {event.addedToJoomla && (
                <span className="shrink-0 rounded-full bg-lime-400 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-black">
                  Added
                </span>
              )}
            </div>
            <div className="mt-1">{metaRow}</div>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          {addedToggle}
          {chevron}
          {editLink}
          {deleteButton}
        </div>
      </div>

      {/* ── Accordion (shared) — field completeness checklist. ── */}
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
                  <li key={f.label} className="flex items-center gap-2 text-sm">
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
