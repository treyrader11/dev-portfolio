"use client";

import Link from "next/link";
import Image from "next/image";
import {
  RiPencilLine,
  RiDeleteBinLine,
  RiImageLine,
  RiMapPin2Line,
  RiCalendarLine,
  RiCheckboxCircleFill,
  RiCheckboxBlankCircleLine,
} from "react-icons/ri";
import { cn, resolveImageSrc } from "@/lib/utils";
import { EventStatusChips } from "./event-status-chips";
import { eventDateRange } from "../lib/format";
import { type FqdEventListItem } from "../types/fqd-types";

interface Props {
  event: FqdEventListItem;
  onDelete: (event: FqdEventListItem) => void;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  onToggleAdded?: (event: FqdEventListItem) => void;
}

// A compact list-row rendering of an event (same data/actions as the card,
// laid out horizontally for the list view).
export function EventListItem({
  event,
  onDelete,
  selected,
  onToggleSelect,
  onToggleAdded,
}: Props) {
  const detailHref = `/admin/french-quarter-direct/event/${event.slug}`;
  const editHref = `/admin/french-quarter-direct/create-event/${event.id}`;
  const thumbnail = event.images[0]?.url;
  const dateLabel = eventDateRange(event.startDate, event.endDate);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border bg-dark-400 p-3 transition-colors",
        selected
          ? "border-secondary/60"
          : event.addedToJoomla
            ? "border-lime-400/40"
            : "border-dark-600 hover:border-secondary/40",
      )}
    >
      {onToggleSelect && (
        <input
          type="checkbox"
          checked={!!selected}
          onChange={() => onToggleSelect(event.id)}
          aria-label={`Select ${event.title}`}
          className="size-4 shrink-0 accent-secondary"
        />
      )}

      <Link href={detailHref} className="flex min-w-0 flex-1 items-center gap-3">
        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-dark-600 bg-dark-600">
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
            <div className="flex shrink-0 items-center gap-1.5">
              <EventStatusChips event={event} />
            </div>
            {event.addedToJoomla && (
              <span className="shrink-0 rounded-full bg-lime-400 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-black">
                Added
              </span>
            )}
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
              {event.images.length} image{event.images.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex shrink-0 items-center gap-2">
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
                : "text-light-400 hover:text-white",
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
  );
}

// Loading placeholder matching the list-item row.
export function EventListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dark-600 bg-dark-400 p-3">
      <div className="size-4 shrink-0 animate-pulse rounded bg-dark-600" />
      <div className="h-14 w-20 shrink-0 animate-pulse rounded-lg bg-dark-600" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/2 animate-pulse rounded bg-dark-600" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-dark-600" />
      </div>
    </div>
  );
}
