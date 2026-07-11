import Link from "next/link";
import Image from "next/image";
import {
  RiDeleteBinLine,
  RiPencilLine,
  RiImageLine,
  RiMapPin2Line,
  RiCalendarLine,
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

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 rounded-lg border bg-dark-400 p-4 transition-colors",
        selected ? "border-secondary/60" : "border-dark-600",
      )}
    >
      {onToggleSelect && (
        <input
          type="checkbox"
          checked={!!selected}
          onChange={() => onToggleSelect(event.id)}
          aria-label={`Select ${event.title}`}
          className="mt-4 size-4 shrink-0 accent-secondary"
        />
      )}
      <Link href={detailHref} className="flex min-w-0 flex-1 items-center gap-3">
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
          </div>
        </div>
      </Link>

      <div className="flex shrink-0 items-center gap-2">
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
