import Link from "next/link";
import Image from "next/image";
import {
  RiPencilLine,
  RiMapPin2Line,
  RiCalendarLine,
  RiExternalLinkLine,
} from "react-icons/ri";
import AdminLayout from "@/features/admin/components/admin-layout";
import { EventExport } from "./event-export";
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

function fmt(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

// A labeled detail row that renders only when it has a value.
function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  if (children === null || children === undefined || children === "") return null;
  return (
    <div className="border-b border-dark-600 py-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-light-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-white">{children}</dd>
    </div>
  );
}

function ExternalLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-secondary hover:underline"
    >
      {href}
      <RiExternalLinkLine className="size-3.5" />
    </a>
  );
}

interface Props {
  event: FqdEventListItem;
}

export function EventDetailPage({ event }: Props) {
  const status = event.status as FqdStatus;
  const sameDay =
    !event.endDate || event.endDate.slice(0, 10) === event.startDate.slice(0, 10);
  const dateLabel = sameDay
    ? fmt(event.startDate)
    : `${fmt(event.startDate)} – ${fmt(event.endDate as string)}`;

  return (
    <AdminLayout
      title={event.title}
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "French Quarter Direct", href: "/admin/french-quarter-direct" },
        { label: "Events", href: "/admin/french-quarter-direct/events" },
        { label: event.title },
      ]}
    >
      <div className="max-w-4xl space-y-8">
        {/* Header row: status + edit. */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium capitalize",
              FQD_STATUS_BADGE[status] ?? FQD_STATUS_BADGE.draft,
            )}
          >
            {status}
          </span>
          <div className="flex items-center gap-2">
            <EventExport eventId={event.id} />
            <Link
              href={`/admin/french-quarter-direct/create-event/${event.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-dark-600 px-3 py-2 text-sm text-white transition-colors hover:border-secondary/60"
            >
              <RiPencilLine className="size-4" />
              Edit
            </Link>
          </div>
        </div>

        {/* Image carousel — same horizontal rail as the public "Similar
            projects" section, adapted to the dark admin theme. */}
        {event.images.length > 0 && (
          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">
              Images ({event.images.length})
            </h2>
            <div className="-mx-4 flex gap-6 overflow-x-auto scroll-smooth px-4 pb-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {event.images.map((img) => (
                <div
                  key={img.id}
                  className="group w-[300px] flex-shrink-0 sm:w-[360px]"
                >
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-dark-600 bg-dark-600">
                    <Image
                      src={resolveImageSrc(img.url)}
                      alt={img.alt ?? event.title}
                      fill
                      sizes="(max-width: 640px) 300px, 360px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {img.alt && (
                    <p className="mt-2 truncate text-sm text-light-400">
                      {img.alt}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Details. */}
        <dl className="rounded-lg border border-dark-600 bg-dark-400 px-5">
          <Detail label="When">
            <span className="inline-flex items-center gap-1.5">
              <RiCalendarLine className="size-4 text-light-400" />
              {dateLabel}
              {event.startTime ? ` · ${event.startTime}` : ""}
            </span>
          </Detail>
          <Detail label="Location">
            {event.locationName || event.address ? (
              <span className="inline-flex items-center gap-1.5">
                <RiMapPin2Line className="size-4 text-light-400" />
                {[event.locationName, event.address]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            ) : null}
          </Detail>
          <Detail label="Category">
            {event.category
              ? `${event.category}${event.subcategory ? ` / ${event.subcategory}` : ""}`
              : null}
          </Detail>
          <Detail label="Description">
            {event.description ? (
              <p className="whitespace-pre-wrap">{event.description}</p>
            ) : null}
          </Detail>
          <Detail label="Admission">{event.admission || null}</Detail>
          <Detail label="Tickets">
            {event.ticketUrl ? <ExternalLink href={event.ticketUrl} /> : null}
          </Detail>
          <Detail label="Organizer">{event.organizer || null}</Detail>
          <Detail label="Expected attendance">
            {event.expectedAttendance || null}
          </Detail>
          <Detail label="Age requirement">{event.ageRequirement || null}</Detail>
          <Detail label="Website">
            {event.website ? <ExternalLink href={event.website} /> : null}
          </Detail>
          <Detail label="Notes">
            {event.notes ? (
              <p className="whitespace-pre-wrap">{event.notes}</p>
            ) : null}
          </Detail>
        </dl>
      </div>
    </AdminLayout>
  );
}
