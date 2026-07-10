import { useState } from "react";
import Link from "next/link";
import AdminLayout from "@/features/admin/components/admin-layout";
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import { EventCard } from "./event-card";
import { useFqdEvents } from "../hooks/use-fqd-events";
import type { GetFqdEventsResult } from "../actions/get-events";
import type { FqdEventListItem } from "../types/fqd-types";

interface Props {
  data: GetFqdEventsResult;
}

const CRUMBS = [
  { label: "Dashboard", href: "/admin" },
  { label: "French Quarter Direct", href: "/admin/french-quarter-direct" },
  { label: "Events" },
];

export function EventsListPage({ data }: Props) {
  const { addNotification } = useNotificationsContext();
  const { events, removeEvent } = useFqdEvents(data.events);
  const [target, setTarget] = useState<FqdEventListItem | null>(null);

  async function doDelete() {
    if (!target) return;
    const ok = await removeEvent(target.id);
    addNotification({
      text: ok ? "Event deleted" : "Couldn't delete event",
      variant: ok ? "success" : "error",
    });
    setTarget(null);
  }

  return (
    <AdminLayout title="Events" breadcrumbs={CRUMBS}>
      <div className="max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-light-400">
            {data.total} event{data.total === 1 ? "" : "s"}
          </p>
          <Link
            href="/admin/french-quarter-direct/events/new"
            className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
          >
            Add Event
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="rounded-lg border border-dashed border-dark-600 p-10 text-center">
            <p className="text-white">No events yet.</p>
            <p className="mt-1 text-sm text-light-400">
              Add your first event, or use AI research on the new-event form to
              pull one in.
            </p>
            <Link
              href="/admin/french-quarter-direct/events/new"
              className="mt-4 inline-block rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
            >
              Add Event
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((e) => (
              <EventCard key={e.id} event={e} onDelete={setTarget} />
            ))}
          </div>
        )}

        {data.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between text-sm">
            {data.page > 1 ? (
              <Link
                href={`?page=${data.page - 1}`}
                className="text-secondary hover:underline"
              >
                ← Previous
              </Link>
            ) : (
              <span />
            )}
            <span className="text-light-400">
              Page {data.page} of {data.totalPages}
            </span>
            {data.page < data.totalPages ? (
              <Link
                href={`?page=${data.page + 1}`}
                className="text-secondary hover:underline"
              >
                Next →
              </Link>
            ) : (
              <span />
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={target !== null}
        title="Delete event?"
        message={`This permanently deletes "${target?.title ?? "this event"}" and its images. This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={doDelete}
        onCancel={() => setTarget(null)}
      />
    </AdminLayout>
  );
}
