import Link from "next/link";
import Image from "next/image";
import {
  RiPencilLine,
  RiMapPin2Line,
  RiCalendarLine,
  RiDownloadLine,
  RiFolderZipLine,
} from "react-icons/ri";
import AdminLayout from "@/features/admin/components/admin-layout";
import { EventExport } from "./event-export";
import { EventLocationMap } from "./event-location-map";
import { EventImageAlt } from "./event-image-alt";
import { RichText } from "./rich-text";
import { EventStatusChips } from "./event-status-chips";
import { resolveImageSrc } from "@/lib/utils";
import { eventDateRange } from "../lib/format";
import { type FqdEventListItem } from "../types/fqd-types";

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


interface Props {
  event: FqdEventListItem;
}

export function EventDetailPage({ event }: Props) {
  const dateLabel = eventDateRange(event.startDate, event.endDate);

  return (
    <AdminLayout
      title={event.title}
      hideHeaderTitle
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "French Quarter Direct", href: "/admin/french-quarter-direct" },
        { label: "Events", href: "/admin/french-quarter-direct/events" },
        { label: event.title },
      ]}
      headerActions={
        <>
          <EventExport eventId={event.id} />
          {event.images.length > 0 && (
            <a
              href={`/api/fqd/events/${event.id}?download=zip`}
              aria-label="Download all images (.zip)"
              className="inline-flex items-center gap-1.5 rounded-lg border border-dark-600 px-3 py-2 text-sm text-white transition-colors hover:border-secondary/60"
            >
              <RiFolderZipLine className="size-4" />
              <span className="hidden lg:inline">Download all (.zip)</span>
            </a>
          )}
          <Link
            href={`/admin/french-quarter-direct/create-event/${event.id}`}
            aria-label="Edit event"
            className="inline-flex items-center gap-1.5 rounded-lg border border-dark-600 px-3 py-2 text-sm text-white transition-colors hover:border-secondary/60"
          >
            <RiPencilLine className="size-4" />
            <span className="hidden lg:inline">Edit</span>
          </Link>
        </>
      }
    >
      <div className="w-full space-y-8 md:max-w-4xl">
        {/* Page title + status. */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-white font-pp-acma sm:text-3xl">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <EventStatusChips event={event} />
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
              {event.images.map((img, i) => (
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
                    <a
                      href={`/api/fqd/events/${event.id}?download=image&index=${i}`}
                      aria-label="Download image as PNG"
                      className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-lg bg-black/60 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/80 group-hover:opacity-100"
                    >
                      <RiDownloadLine className="size-3.5" />
                      PNG
                    </a>
                  </div>
                  <EventImageAlt
                    alt={
                      img.alt ||
                      `${event.slug}_${String(i + 1).padStart(2, "0")}`
                    }
                  />
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
            {event.ticketUrl ? <RichText text={event.ticketUrl} /> : null}
          </Detail>
          <Detail label="Organizer">{event.organizer || null}</Detail>
          <Detail label="Expected attendance">
            {event.expectedAttendance ? (
              <RichText text={event.expectedAttendance} />
            ) : null}
          </Detail>
          <Detail label="Age requirement">{event.ageRequirement || null}</Detail>
          <Detail label="Website">
            {event.website ? <RichText text={event.website} /> : null}
          </Detail>
          <Detail label="Notes">
            {event.notes ? (
              <p className="whitespace-pre-wrap">
                <RichText text={event.notes} />
              </p>
            ) : null}
          </Detail>
        </dl>

        {/* Location map on all devices; the directions button is mobile-only. */}
        <EventLocationMap
          locationName={event.locationName}
          address={event.address}
        />
      </div>
    </AdminLayout>
  );
}
