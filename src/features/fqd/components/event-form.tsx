import {
  AdminInput,
  AdminTextarea,
  ADMIN_FIELD_CONTROL,
} from "@/features/admin/components/admin-field";
import { AdminFocusScope } from "@/features/admin/components/admin-form";
import { cn, slugify } from "@/lib/utils";
import { useState } from "react";
import { RiLoader4Line, RiSparkling2Line } from "react-icons/ri";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import { CategorySelect } from "./category-select";
import { ImageManager } from "./image-manager";
import { AiResearchPanel } from "./ai-research-panel";
import { useFqdProvider } from "../hooks/use-fqd-provider";
import type { ResearchResult } from "../hooks/use-event-research";
import {
  FQD_STATUSES,
  type FqdEventFormValues,
  type FqdStatus,
} from "../types/fqd-types";

interface Props {
  values: FqdEventFormValues;
  onChange: (values: FqdEventFormValues) => void;
  onApplyResearch: (result: ResearchResult) => void;
  imagesLoading?: boolean;
}

const CONTROL = cn(ADMIN_FIELD_CONTROL, "[color-scheme:dark]");

// Fields that support single-field AI web search, with display labels.
const AI_FIELD_LABELS = {
  startDate: "Start date",
  endDate: "End date",
  startTime: "Start time",
  locationName: "Location",
  address: "Address",
  description: "Description",
  admission: "Admission",
  website: "Website",
  ticketUrl: "Ticket URL",
  organizer: "Organizer",
  expectedAttendance: "Expected attendance",
  ageRequirement: "Age requirement",
  notes: "Notes",
} as const;

type AiField = keyof typeof AI_FIELD_LABELS;

function SectionHeading({ children }: { children: string }) {
  return (
    <h3 className="border-b border-dark-600 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-light-400">
      {children}
    </h3>
  );
}

// Labeled wrapper for the non-AdminInput controls (date / select).
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-1">
      <label className="text-sm font-medium text-white">{label}</label>
      {children}
    </div>
  );
}

export function EventForm({
  values,
  onChange,
  onApplyResearch,
  imagesLoading = false,
}: Props) {
  const set = (patch: Partial<FqdEventFormValues>) =>
    onChange({ ...values, ...patch });

  const { addNotification } = useNotificationsContext();
  const provider = useFqdProvider((s) => s.provider);
  // Which single field is currently being web-searched (null = none).
  const [genField, setGenField] = useState<AiField | null>(null);

  // Keep the slug auto-linked to the title until the user edits it by hand.
  const slugAuto = values.slug === "" || values.slug === slugify(values.title);

  // AI web-search a single field's value from the event's current details.
  async function generateField(field: AiField) {
    if (genField) return;
    if (!values.title.trim()) {
      addNotification({
        text: "Add a title first so the search has something to go on",
        variant: "error",
      });
      return;
    }
    setGenField(field);
    try {
      const res = await fetch("/api/fqd/generate-field", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field,
          title: values.title,
          startDate: values.startDate,
          locationName: values.locationName,
          address: values.address,
          category: values.category,
          subcategory: values.subcategory,
          website: values.website,
          provider,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        if (data?.value) {
          // Green — found a value.
          set({ [field]: data.value } as Partial<FqdEventFormValues>);
          addNotification({
            text: `${AI_FIELD_LABELS[field]} filled from the web`,
            variant: "success",
          });
        } else {
          // Amber — no result.
          addNotification({
            text: `No result for ${AI_FIELD_LABELS[field].toLowerCase()} — add more details or enter it manually`,
            variant: "warning",
          });
        }
      } else if (res.status === 429 || data?.code === "quota") {
        // Amber — usage / credits limit reached.
        addNotification({
          text: `AI usage limit reached — ${data?.error ?? "try another model"}`,
          variant: "warning",
        });
      } else {
        // Red — genuine error, exact reason.
        addNotification({
          text: data?.error ?? "Search failed",
          variant: "error",
        });
      }
    } catch {
      addNotification({
        text: "Search failed — request error",
        variant: "error",
      });
    } finally {
      setGenField(null);
    }
  }

  // Wrap a field with an "AI" web-search button pinned to its top-right.
  function aiWrap(field: AiField, node: React.ReactNode) {
    const busy = genField === field;
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => generateField(field)}
          disabled={!!genField}
          title={`AI web search for ${AI_FIELD_LABELS[field].toLowerCase()}`}
          className="absolute right-0 top-0 z-10 inline-flex items-center gap-1 text-xs font-medium text-secondary transition-colors hover:text-secondary/80 disabled:opacity-50"
        >
          {busy ? (
            <RiLoader4Line className="size-3.5 animate-spin" />
          ) : (
            <RiSparkling2Line className="size-3.5" />
          )}
          {busy ? "Searching…" : "AI"}
        </button>
        {node}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* AI research + auto-fill — open by default when creating. */}
      <AiResearchPanel onApply={onApplyResearch} />

      <AdminFocusScope className="space-y-4 rounded-lg border border-dark-600 bg-dark-400 p-4 sm:p-6">
        <SectionHeading>Core info</SectionHeading>
        <AdminInput
          label="Title"
          required
          value={values.title}
          onChange={(v) =>
            set({ title: v, ...(slugAuto ? { slug: slugify(v) } : {}) })
          }
        />
        <AdminInput
          label="Slug"
          value={values.slug}
          onChange={(v) => set({ slug: v })}
          hint="Auto-generated from the title; edit to override."
        />
        <Field label="Status">
          <select
            className={CONTROL}
            value={values.status}
            onChange={(e) => set({ status: e.target.value as FqdStatus })}
          >
            {FQD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <SectionHeading>Dates &amp; time</SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {aiWrap(
            "startDate",
            <Field label="Start date *">
              <input
                type="date"
                className={CONTROL}
                value={values.startDate}
                onChange={(e) => set({ startDate: e.target.value })}
              />
            </Field>,
          )}
          {aiWrap(
            "endDate",
            <Field label="End date">
              <input
                type="date"
                className={CONTROL}
                value={values.endDate}
                onChange={(e) => set({ endDate: e.target.value })}
              />
            </Field>,
          )}
          {aiWrap(
            "startTime",
            <AdminInput
              label="Start time"
              value={values.startTime}
              placeholder="6:30 AM"
              onChange={(v) => set({ startTime: v })}
            />,
          )}
        </div>

        <SectionHeading>Location</SectionHeading>
        {aiWrap(
          "locationName",
          <AdminInput
            label="Location / venue name"
            value={values.locationName}
            onChange={(v) => set({ locationName: v })}
          />,
        )}
        {aiWrap(
          "address",
          <AdminInput
            label="Address"
            value={values.address}
            onChange={(v) => set({ address: v })}
          />,
        )}

        <SectionHeading>Classification</SectionHeading>
        <CategorySelect
          category={values.category}
          subcategory={values.subcategory}
          onCategoryChange={(v) => set({ category: v })}
          onSubcategoryChange={(v) => set({ subcategory: v })}
          description={values.description}
          title={values.title}
        />

        <SectionHeading>Details</SectionHeading>
        {aiWrap(
          "description",
          <AdminTextarea
            label="Description"
            value={values.description}
            onChange={(v) => set({ description: v })}
          />,
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {aiWrap(
            "admission",
            <AdminInput
              label="Admission / ticket info"
              value={values.admission}
              onChange={(v) => set({ admission: v })}
            />,
          )}
          {aiWrap(
            "ticketUrl",
            <AdminInput
              label="Ticket URL"
              value={values.ticketUrl}
              onChange={(v) => set({ ticketUrl: v })}
            />,
          )}
          {aiWrap(
            "organizer",
            <AdminInput
              label="Organizer"
              value={values.organizer}
              onChange={(v) => set({ organizer: v })}
            />,
          )}
          {aiWrap(
            "expectedAttendance",
            <AdminInput
              label="Expected attendance"
              value={values.expectedAttendance}
              onChange={(v) => set({ expectedAttendance: v })}
            />,
          )}
          {aiWrap(
            "ageRequirement",
            <AdminInput
              label="Age requirement"
              value={values.ageRequirement}
              onChange={(v) => set({ ageRequirement: v })}
            />,
          )}
          {aiWrap(
            "website",
            <AdminInput
              label="Website"
              value={values.website}
              onChange={(v) => set({ website: v })}
            />,
          )}
        </div>
        {aiWrap(
          "notes",
          <AdminTextarea
            label="Notes"
            value={values.notes}
            onChange={(v) => set({ notes: v })}
          />,
        )}

        <SectionHeading>Event Images</SectionHeading>
        {imagesLoading && (
          <p className="flex items-center gap-1.5 text-xs text-secondary">
            <RiLoader4Line className="size-3.5 animate-spin" />
            Pulling images from the event website…
          </p>
        )}
        <ImageManager
          images={values.images}
          onChange={(images) => set({ images })}
          slug={values.slug || slugify(values.title) || "event"}
          searchDetails={{
            title: values.title,
            locationName: values.locationName,
            address: values.address,
            startDate: values.startDate,
            category: values.category,
            subcategory: values.subcategory,
            website: values.website,
            description: values.description,
          }}
        />
      </AdminFocusScope>
    </div>
  );
}
