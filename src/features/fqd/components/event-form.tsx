import {
  AdminInput,
  AdminTextarea,
  ADMIN_FIELD_CONTROL,
} from "@/features/admin/components/admin-field";
import { AdminFocusScope } from "@/features/admin/components/admin-form";
import { cn, slugify } from "@/lib/utils";
import { RiLoader4Line } from "react-icons/ri";
import { CategorySelect } from "./category-select";
import { ImageManager } from "./image-manager";
import { AiResearchPanel } from "./ai-research-panel";
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
  isNew: boolean;
  imagesLoading?: boolean;
}

const CONTROL = cn(ADMIN_FIELD_CONTROL, "[color-scheme:dark]");

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
  isNew,
  imagesLoading = false,
}: Props) {
  const set = (patch: Partial<FqdEventFormValues>) =>
    onChange({ ...values, ...patch });

  // Keep the slug auto-linked to the title until the user edits it by hand.
  const slugAuto = values.slug === "" || values.slug === slugify(values.title);

  return (
    <div className="space-y-4">
      {/* AI research + auto-fill — open by default when creating. */}
      <AiResearchPanel onApply={onApplyResearch} defaultOpen={isNew} />

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
          <Field label="Start date *">
            <input
              type="date"
              className={CONTROL}
              value={values.startDate}
              onChange={(e) => set({ startDate: e.target.value })}
            />
          </Field>
          <Field label="End date">
            <input
              type="date"
              className={CONTROL}
              value={values.endDate}
              onChange={(e) => set({ endDate: e.target.value })}
            />
          </Field>
          <AdminInput
            label="Start time"
            value={values.startTime}
            placeholder="6:30 AM"
            onChange={(v) => set({ startTime: v })}
          />
        </div>

        <SectionHeading>Location</SectionHeading>
        <AdminInput
          label="Location / venue name"
          value={values.locationName}
          onChange={(v) => set({ locationName: v })}
        />
        <AdminInput
          label="Address"
          value={values.address}
          onChange={(v) => set({ address: v })}
        />

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
        <AdminTextarea
          label="Description"
          value={values.description}
          onChange={(v) => set({ description: v })}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminInput
            label="Admission / ticket info"
            value={values.admission}
            onChange={(v) => set({ admission: v })}
          />
          <AdminInput
            label="Ticket URL"
            value={values.ticketUrl}
            onChange={(v) => set({ ticketUrl: v })}
          />
          <AdminInput
            label="Organizer"
            value={values.organizer}
            onChange={(v) => set({ organizer: v })}
          />
          <AdminInput
            label="Expected attendance"
            value={values.expectedAttendance}
            onChange={(v) => set({ expectedAttendance: v })}
          />
          <AdminInput
            label="Age requirement"
            value={values.ageRequirement}
            onChange={(v) => set({ ageRequirement: v })}
          />
          <AdminInput
            label="Website"
            value={values.website}
            onChange={(v) => set({ website: v })}
          />
        </div>
        <AdminTextarea
          label="Notes"
          value={values.notes}
          onChange={(v) => set({ notes: v })}
        />

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
        />
      </AdminFocusScope>
    </div>
  );
}
