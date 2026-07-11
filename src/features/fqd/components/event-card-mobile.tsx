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

export function EventCardMobile({
  event,
  onDelete,
  selected,
  onToggleSelect,
  onToggleAdded,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const detailHref = `/admin/french-quarter-direct/event/${event.slug}`;
  const editHref = `/admin/french-quarter-direct/create-event/${event.id}`;
  const thumbnail = event.images[0]?.url;
  const status = event.status as FqdStatus;
  const dateLabel = eventDateRange(event.startDate, event.endDate);

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

  return (
    <div
      className={cn(
        // Full width in list context, rounded card
        "relative w-full rounded-2xl overflow-hidden",
        "transition-shadow duration-300",
        selected
          ? "ring-2 ring-secondary/60"
          : event.addedToJoomla
            ? "ring-1 ring-lime-400/40"
            : "",
      )}
      style={{
        boxShadow: hovered
          ? "0 16px 40px rgba(0,0,0,0.5)"
          : "0 4px 16px rgba(0,0,0,0.3)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Floating action buttons — outside Link ── */}
      <div
        className={cn(
          "absolute right-3 top-3 z-50 flex items-center gap-2",
          "transition-opacity duration-200",
          hovered
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      >
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
              "rounded-full bg-black/50 p-1.5 backdrop-blur-sm transition-colors",
              event.addedToJoomla
                ? "text-lime-400 hover:text-lime-300"
                : "text-white/70 hover:text-white",
            )}
          >
            {event.addedToJoomla ? (
              <RiCheckboxCircleFill className="size-5" />
            ) : (
              <RiCheckboxBlankCircleLine className="size-5" />
            )}
          </button>
        )}

        <Link
          href={editHref}
          aria-label="Edit event"
          className="rounded-full bg-black/50 p-1.5 backdrop-blur-sm text-white/70 transition-colors hover:text-white"
        >
          <RiPencilLine className="size-5" />
        </Link>

        <button
          type="button"
          aria-label="Delete event"
          onClick={() => onDelete(event)}
          className="rounded-full bg-black/50 p-1.5 backdrop-blur-sm text-error transition-colors hover:text-error-400"
        >
          <RiDeleteBinLine className="size-5" />
        </button>
      </div>

      {/* ── Selection checkbox — outside Link, top-left ── */}
      {onToggleSelect && (
        <button
          type="button"
          onClick={() => onToggleSelect(event.id)}
          aria-label={`Select ${event.title}`}
          className="absolute left-3 top-3 z-50 rounded-full bg-black/50 p-1.5 backdrop-blur-sm"
        >
          {selected ? (
            <RiCheckboxCircleFill className="size-5 text-secondary" />
          ) : (
            <RiCheckboxBlankCircleLine className="size-5 text-white" />
          )}
        </button>
      )}

      {/* ── Card body — Link wraps poster + info ── */}
      <Link href={detailHref} className="block">
        {/* ── Poster ── */}
        <div className="relative overflow-hidden">
          <div
            className={cn(
              "transition-transform duration-300 ease-out",
              hovered ? "scale-[1.04]" : "scale-100",
            )}
          >
            {/* Poster height: taller on mobile so it feels like a proper card */}
            <div className="relative h-44 w-full bg-dark-600 sm:h-36">
              {thumbnail ? (
                <Image
                  src={resolveImageSrc(thumbnail)}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 800px"
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full items-center justify-center text-light-400">
                  <RiImageLine className="size-10 opacity-50" />
                </span>
              )}
            </div>
          </div>

          {/* Hover overlay: dark veil + gradient scrim + title */}
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-300 pointer-events-none",
              hovered ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="absolute inset-0 bg-black/45" />
            <div
              className="absolute bottom-0 left-0 right-0 h-[70%]"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.82) 100%)",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 pb-3">
              <p
                className="text-white text-xl font-bold leading-snug line-clamp-2"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
              >
                {event.title}
              </p>
            </div>
          </div>

          {/* Status badge — bottom-right on poster, fades out on hover */}
          <span
            className={cn(
              "absolute right-3 bottom-3 z-10 rounded-full px-2.5 py-0.5",
              "text-xs font-medium capitalize",
              "transition-opacity duration-200",
              hovered ? "opacity-0" : "opacity-100",
              FQD_STATUS_BADGE[status] ?? FQD_STATUS_BADGE.draft,
            )}
          >
            {status}
          </span>

          {/* "Added" badge — bottom-left on poster, always visible */}
          {event.addedToJoomla && (
            <span className="absolute left-3 bottom-3 z-10 rounded-full bg-lime-400 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-black shadow">
              Added
            </span>
          )}
        </div>

        {/* ── Info section ── */}
        <div className="bg-dark-400 px-4 pt-3 pb-4">
          {/* Title (always visible — poster overlay is hover-only) */}
          <p className="text-base font-semibold text-white line-clamp-1">
            {event.title}
          </p>

          {/* Status + meta row */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-light-400">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-medium capitalize",
                FQD_STATUS_BADGE[status] ?? FQD_STATUS_BADGE.draft,
              )}
            >
              {status}
            </span>

            <span className="inline-flex items-center gap-1">
              <RiCalendarLine className="size-3" />
              {dateLabel}
              {event.startTime ? ` · ${event.startTime}` : ""}
            </span>

            {event.locationName && (
              <span className="inline-flex items-center gap-1">
                <RiMapPin2Line className="size-3" />
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
              <RiImageLine className="size-3" />
              {event.images.length} image{event.images.length === 1 ? "" : "s"}
            </span>
          </div>

          {/* Field completeness + accordion toggle */}
          <div className="mt-3 flex items-center justify-between border-t border-dark-600 pt-2.5">
            <span className="text-xs text-light-400">
              <span
                className={cn(
                  "font-semibold",
                  filled === fields.length ? "text-success" : "text-secondary",
                )}
              >
                {filled}/{fields.length}
              </span>{" "}
              fields complete
            </span>

            <button
              type="button"
              aria-label={expanded ? "Hide fields" : "Show fields"}
              aria-expanded={expanded}
              onClick={(e) => {
                e.preventDefault();
                setExpanded((v) => !v);
              }}
              className="inline-flex items-center gap-1 text-xs text-light-400 transition-colors hover:text-white"
            >
              {expanded ? "Hide" : "Details"}
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                <RiArrowDownSLine className="size-4" />
              </motion.span>
            </button>
          </div>
        </div>
      </Link>

      {/* ── Accordion — field completeness checklist ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="fields"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden bg-dark-400"
          >
            <div className="border-t border-dark-600 px-4 py-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-light-400">
                Fields ({filled}/{fields.length})
              </p>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3">
                {fields.map((f) => (
                  <li key={f.label} className="flex items-center gap-2 text-sm">
                    {f.ok ? (
                      <RiCheckLine className="size-3.5 shrink-0 text-success" />
                    ) : (
                      <RiCloseLine className="size-3.5 shrink-0 text-error" />
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
