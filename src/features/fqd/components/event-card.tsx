import Link from "next/link";
import {
  RiDeleteBinLine,
  RiPencilLine,
  RiEyeLine,
  RiMapPin2Line,
  RiCalendarLine,
} from "react-icons/ri";
import { cn } from "@/lib/utils";
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
}

export function EventCard({ event, onDelete }: Props) {
  const href = `/admin/french-quarter-direct/create-event/${event.id}`;
  const status = event.status as FqdStatus;
  const sameDay =
    !event.endDate || event.endDate.slice(0, 10) === event.startDate.slice(0, 10);
  const dateLabel = sameDay
    ? fmt(event.startDate)
    : `${fmt(event.startDate)} – ${fmt(event.endDate as string)}`;

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-dark-600 bg-dark-400 p-4">
      <Link href={href} className="min-w-0 flex-1">
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
      </Link>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          href={`/admin/french-quarter-direct/event/${event.slug}`}
          aria-label="View event"
          className="text-light-400 transition-colors hover:text-white"
        >
          <RiEyeLine className="size-5" />
        </Link>
        <Link
          href={href}
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
