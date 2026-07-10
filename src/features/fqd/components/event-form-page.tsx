import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import AdminLayout from "@/features/admin/components/admin-layout";
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import { slugify } from "@/lib/utils";
import { EventForm } from "./event-form";
import type { ResearchResult } from "../hooks/use-event-research";
import {
  emptyFqdEvent,
  type FqdEventFormValues,
  type FqdEventListItem,
} from "../types/fqd-types";

interface Props {
  mode: "create" | "edit";
  event?: FqdEventListItem;
}

const CRUMBS = [
  { label: "Dashboard", href: "/admin" },
  { label: "French Quarter Direct", href: "/admin/french-quarter-direct" },
  { label: "Events", href: "/admin/french-quarter-direct/events" },
];

// Convert a saved event into the form's value shape (dates → YYYY-MM-DD).
function toFormValues(event: FqdEventListItem): FqdEventFormValues {
  return {
    title: event.title,
    slug: event.slug,
    status: event.status as FqdEventFormValues["status"],
    startDate: event.startDate.slice(0, 10),
    endDate: event.endDate ? event.endDate.slice(0, 10) : "",
    startTime: event.startTime ?? "",
    locationName: event.locationName ?? "",
    address: event.address ?? "",
    category: event.category ?? "",
    subcategory: event.subcategory ?? "",
    description: event.description ?? "",
    admission: event.admission ?? "",
    ticketUrl: event.ticketUrl ?? "",
    organizer: event.organizer ?? "",
    expectedAttendance: event.expectedAttendance ?? "",
    ageRequirement: event.ageRequirement ?? "",
    website: event.website ?? "",
    notes: event.notes ?? "",
    images: event.images.map((img) => ({
      id: img.id,
      url: img.url,
      cloudinaryId: img.cloudinaryId,
      alt: img.alt,
      order: img.order,
    })),
  };
}

export function EventFormPage({ mode, event }: Props) {
  const router = useRouter();
  const { addNotification } = useNotificationsContext();
  const isNew = mode === "create";

  const [form, setForm] = useState<FqdEventFormValues>(() =>
    event ? toFormValues(event) : { ...emptyFqdEvent },
  );
  const [rawResearch, setRawResearch] = useState<unknown>(undefined);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const initial = useRef(JSON.stringify(form));
  const dirty = JSON.stringify(form) !== initial.current;

  // Apply an AI research/parse result: fill blank/updated fields, keep the slug
  // linked, mark researched, and stash the raw response for audit.
  function applyResearch({ fields, raw }: ResearchResult) {
    setForm((prev) => {
      const next = { ...prev };
      const pick = (v: string | null | undefined, cur: string) =>
        v && v.trim() ? v.trim() : cur;
      next.title = pick(fields.title, prev.title);
      next.startDate = fields.startDate
        ? fields.startDate.slice(0, 10)
        : prev.startDate;
      next.endDate = fields.endDate ? fields.endDate.slice(0, 10) : prev.endDate;
      next.startTime = pick(fields.startTime, prev.startTime);
      next.locationName = pick(fields.locationName, prev.locationName);
      next.address = pick(fields.address, prev.address);
      next.description = pick(fields.description, prev.description);
      next.admission = pick(fields.admission, prev.admission);
      next.website = pick(fields.website, prev.website);
      next.category = pick(fields.category, prev.category);
      next.subcategory = pick(fields.subcategory, prev.subcategory);
      next.ticketUrl = pick(fields.ticketUrl, prev.ticketUrl);
      next.organizer = pick(fields.organizer, prev.organizer);
      next.expectedAttendance = pick(
        fields.expectedAttendance,
        prev.expectedAttendance,
      );
      next.ageRequirement = pick(fields.ageRequirement, prev.ageRequirement);
      next.notes = pick(fields.notes, prev.notes);
      if (!prev.slug && next.title) next.slug = slugify(next.title);
      next.status = "researched";
      return next;
    });
    setRawResearch(raw);
    const filled = Object.values(fields).filter(
      (v) => typeof v === "string" && v.trim(),
    ).length;
    addNotification({
      text: `Research complete — populated ${filled} field${filled === 1 ? "" : "s"}`,
      variant: "success",
    });
  }

  async function handleSave() {
    if (!form.title.trim() || !form.startDate) {
      addNotification({
        text: "Title and start date are required",
        variant: "error",
      });
      return;
    }
    setSaving(true);
    const res = await fetch(
      isNew ? "/api/fqd/events" : `/api/fqd/events/${event?.id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rawResearch }),
      },
    );
    setSaving(false);
    if (res.ok) {
      addNotification({ text: "Event saved", variant: "success" });
      router.push("/admin/french-quarter-direct/events");
    } else {
      addNotification({ text: "Couldn't save event", variant: "error" });
    }
  }

  async function handleDelete() {
    if (!event) return;
    const res = await fetch(`/api/fqd/events/${event.id}`, { method: "DELETE" });
    if (res.ok) {
      addNotification({ text: "Event deleted", variant: "success" });
      router.push("/admin/french-quarter-direct/events");
    } else {
      addNotification({ text: "Couldn't delete event", variant: "error" });
    }
    setConfirmDelete(false);
  }

  return (
    <AdminLayout
      title={isNew ? "New Event" : event?.title || "Event"}
      breadcrumbs={[
        ...CRUMBS,
        { label: isNew ? "New" : event?.title || "Edit" },
      ]}
    >
      <div className="w-full max-w-3xl pb-24">
        <EventForm
          values={form}
          onChange={setForm}
          onApplyResearch={applyResearch}
          isNew={isNew}
        />

        {!isNew && (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="mt-4 text-sm text-error transition-colors hover:text-error-600"
          >
            Delete event
          </button>
        )}
      </div>

      {/* Save bar */}
      <motion.div
        initial={false}
        animate={{ y: dirty || isNew ? "0%" : "110%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-dark-600 bg-dark-500/95 backdrop-blur"
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4">
          <span className="text-sm text-light-400">
            {isNew ? "New event" : "Unsaved changes"}
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>
                router.push("/admin/french-quarter-direct/events")
              }
              className="px-4 py-2 text-sm text-light-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success-600 disabled:opacity-50"
            >
              {saving ? "Saving…" : isNew ? "Create" : "Save"}
            </button>
          </div>
        </div>
      </motion.div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete event?"
        message={`This permanently deletes "${event?.title ?? "this event"}" and its images. This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </AdminLayout>
  );
}
