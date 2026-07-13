import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import { RiErrorWarningLine } from "react-icons/ri";
import AdminLayout from "@/features/admin/components/admin-layout";
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import { slugify } from "@/lib/utils";
import { EventForm } from "./event-form";
import { EventDiscoverPanel } from "./event-discover-panel";
import { FqdProviderSelect } from "./fqd-provider-select";
import { fmtEventDate } from "../lib/format";
import { patchEventInListSnapshot } from "../lib/events-list-snapshot";
import type { ResearchResult } from "../hooks/use-event-research";
import {
  emptyFqdEvent,
  type FqdDuplicateInfo,
  type FqdEventFormValues,
  type FqdEventListItem,
} from "../types/fqd-types";

const isBlank = (v?: string | null) => !v || !v.trim();

// The exact fields the "incomplete" list filter checks (get-events.ts), computed
// live from the form so the callout shows which fields still need values and
// clears as they're filled.
function getMissingFormFields(form: FqdEventFormValues): string[] {
  const m: string[] = [];
  if (isBlank(form.startTime)) m.push("Start time");
  if (isBlank(form.endDate)) m.push("End date");
  if (isBlank(form.locationName)) m.push("Location name");
  if (isBlank(form.address)) m.push("Address");
  if (isBlank(form.description)) m.push("Description");
  if (isBlank(form.category)) m.push("Category");
  if (isBlank(form.subcategory)) m.push("Subcategory");
  if (isBlank(form.admission)) m.push("Admission");
  if (isBlank(form.ticketUrl)) m.push("Ticket URL");
  if (isBlank(form.organizer)) m.push("Organizer");
  if (isBlank(form.expectedAttendance)) m.push("Expected attendance");
  if (isBlank(form.ageRequirement)) m.push("Age requirement");
  if (isBlank(form.website)) m.push("Website");
  if (isBlank(form.notes)) m.push("Notes");
  if (form.images.length === 0) m.push("Images");
  return m;
}

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

export function EventFormPage({ event }: Props) {
  const router = useRouter();
  const { addNotification } = useNotificationsContext();

  // The persisted event: the prop for edit mode, or set after the first save of
  // a new event (so re-saves become updates, not new inserts).
  const [savedEvent, setSavedEvent] = useState<FqdEventListItem | undefined>(
    event,
  );
  const isNew = !savedEvent;

  const [form, setForm] = useState<FqdEventFormValues>(() =>
    event ? toFormValues(event) : { ...emptyFqdEvent },
  );
  const missingFields = getMissingFormFields(form);
  const [rawResearch, setRawResearch] = useState<unknown>(undefined);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [duplicate, setDuplicate] = useState<FqdDuplicateInfo | null>(null);
  const [replacing, setReplacing] = useState(false);

  const initial = useRef(JSON.stringify(form));
  const dirty = JSON.stringify(form) !== initial.current;

  // Cmd+S (mac) / Ctrl+S (windows) saves — only when there are changes. A ref
  // holds the latest handler so the mount-only listener never goes stale.
  const saveShortcut = useRef<() => void>(() => {});
  saveShortcut.current = () => {
    if (dirty && !saving) handleSave();
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveShortcut.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Apply an AI research/parse result: fill blank/updated fields, keep the slug
  // linked, mark researched, and stash the raw response for audit.
  function applyResearch({ data: fields, raw }: ResearchResult) {
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
      // Don't force "researched" — an AI populate is surfaced by rawResearch
      // (the "AI Scraped" chip). "researched" is reserved for manual research.
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

    // Bonus: AI web-search for images of this event (event website + other
    // sources) and add them so the admin gets an instant preview.
    void fetchAiImages({
      title: fields.title ?? form.title,
      locationName: fields.locationName,
      address: fields.address,
      startDate: fields.startDate,
      category: fields.category,
      subcategory: fields.subcategory,
      website: fields.website,
      description: fields.description,
    });
  }

  const [fetchingImages, setFetchingImages] = useState(false);

  // Run the AI image search (web search → Cloudinary upload) for the event and
  // append whatever it finds. Covers the event website plus other sources, so
  // it returns more images than scraping the website alone.
  async function fetchAiImages(ctx: {
    title?: string | null;
    locationName?: string | null;
    address?: string | null;
    startDate?: string | null;
    category?: string | null;
    subcategory?: string | null;
    website?: string | null;
    description?: string | null;
  }) {
    if (!ctx.title?.trim()) return;
    setFetchingImages(true);
    try {
      const res = await fetch("/api/fqd/search-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ctx),
      });
      const data = await res.json();
      const found: { url: string; cloudinaryId?: string | null }[] =
        res.ok && Array.isArray(data.images) ? data.images : [];
      if (found.length === 0) return;
      setForm((prev) => {
        const existing = new Set(prev.images.map((i) => i.url));
        const added = found
          .filter((img) => img.url && !existing.has(img.url))
          .map((img, i) => ({
            url: img.url,
            cloudinaryId: img.cloudinaryId ?? null,
            alt: "",
            order: prev.images.length + i,
          }));
        return added.length
          ? { ...prev, images: [...prev.images, ...added] }
          : prev;
      });
      addNotification({
        text: `Added ${found.length} image${found.length === 1 ? "" : "s"} from an AI image search`,
        variant: "success",
      });
    } catch {
      /* images are a bonus — stay quiet on failure */
    } finally {
      setFetchingImages(false);
    }
  }

  // Core submit. On create, the server replies 409 with the existing event when
  // one already exists; passing its id as replaceId deletes it (and its images)
  // and creates this one in its place.
  async function submit(replaceId?: string): Promise<boolean> {
    const res = await fetch(
      savedEvent ? `/api/fqd/events/${savedEvent.id}` : "/api/fqd/events",
      {
        method: savedEvent ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rawResearch,
          ...(replaceId ? { replaceId } : {}),
        }),
      },
    );
    if (res.status === 409) {
      const data = await res.json().catch(() => ({}));
      if (data?.duplicate) {
        setDuplicate(data.duplicate as FqdDuplicateInfo);
        return false;
      }
    }
    if (res.ok) {
      // Sync from the saved row (ids, unique slug, persisted alts) and reset the
      // dirty baseline so the save bar hides. No redirect — the footer has a
      // "View events" button when you're ready to leave.
      const saved = (await res
        .json()
        .catch(() => null)) as FqdEventListItem | null;
      if (saved) {
        const nextForm = toFormValues(saved);
        setSavedEvent(saved);
        setForm(nextForm);
        initial.current = JSON.stringify(nextForm);
        // Keep the events-list snapshot fresh so returning via "View events"
        // shows the updated event (new images, title, etc.) — not stale cache.
        patchEventInListSnapshot(saved);
      } else {
        initial.current = JSON.stringify(form);
      }
      setRawResearch(undefined);
      addNotification({
        text: replaceId ? "Event replaced" : "Event saved",
        variant: "success",
      });
      return true;
    }
    addNotification({ text: "Couldn't save event", variant: "error" });
    return false;
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
    await submit();
    setSaving(false);
  }

  async function handleReplace() {
    if (!duplicate) return;
    setReplacing(true);
    await submit(duplicate.id);
    setReplacing(false);
    setDuplicate(null);
  }

  async function handleDelete() {
    if (!savedEvent) return;
    const res = await fetch(`/api/fqd/events/${savedEvent.id}`, {
      method: "DELETE",
    });
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
      title={isNew ? "New Event" : savedEvent?.title || "Event"}
      breadcrumbs={[
        ...CRUMBS,
        { label: isNew ? "New" : savedEvent?.title || "Edit" },
      ]}
    >
      <div className="mx-auto w-full max-w-3xl pb-24">
        {/* Pick the AI model used by every AI action on this page. */}
        <FqdProviderSelect />

        {/* Create only: bulk-discover upcoming NOLA events not yet in the app. */}
        {isNew && <EventDiscoverPanel />}

        {/* Editing only: which fields are still empty (this is what the list's
            "Incomplete" filter flags). Updates live and clears as you fill them. */}
        {!isNew && missingFields.length > 0 && (
          <div className="mb-4 rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3">
            <p className="flex items-center gap-1.5 text-sm font-medium text-amber-300">
              <RiErrorWarningLine className="size-4 shrink-0" />
              {missingFields.length} field{missingFields.length === 1 ? "" : "s"}{" "}
              still empty
            </p>
            <p className="mt-1 text-xs text-amber-200/90">
              {missingFields.join(" · ")}
            </p>
          </div>
        )}

        <EventForm
          values={form}
          onChange={setForm}
          onApplyResearch={applyResearch}
          imagesLoading={fetchingImages}
        />

        {/* Page footer actions — always offers a way back to the events list. */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href="/admin/french-quarter-direct/events"
            className="text-sm text-secondary transition-colors hover:underline"
          >
            ← View events
          </Link>
          {savedEvent && (
            <>
              <Link
                href={`/admin/french-quarter-direct/event/${savedEvent.slug}`}
                className="text-sm text-secondary transition-colors hover:underline"
              >
                View page
              </Link>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-sm text-error transition-colors hover:text-error-600"
              >
                Delete event
              </button>
            </>
          )}
        </div>
      </div>

      {/* Save bar — only shown when there are unsaved changes. */}
      <motion.div
        initial={false}
        animate={{ y: dirty ? "0%" : "110%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-dark-600 bg-dark-500/95 backdrop-blur"
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4">
          <span className="text-sm text-light-400">Unsaved changes</span>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-light-400 sm:inline">
              ⌘/Ctrl+S
            </span>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              title="Save (⌘/Ctrl+S)"
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
        message={`This permanently deletes "${savedEvent?.title ?? "this event"}" and its images. This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />

      <ConfirmDialog
        open={!!duplicate}
        title="Event already exists"
        message={
          duplicate
            ? `"${duplicate.title}" on ${fmtEventDate(duplicate.startDate)} already exists. Replace it? This deletes the existing event and its images, then saves this one.`
            : ""
        }
        confirmLabel={replacing ? "Replacing…" : "Replace"}
        cancelLabel="Keep existing"
        onConfirm={handleReplace}
        onCancel={() => setDuplicate(null)}
      />
    </AdminLayout>
  );
}
