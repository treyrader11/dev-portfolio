import { useId, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { RiLinkedinFill, RiGithubFill, RiYoutubeFill } from "react-icons/ri";
import AdminLayout from "@/features/admin/components/admin-layout";
import { AdminFocusScope } from "@/features/admin/components/admin-form";
import {
  AdminInput,
  AdminTextarea,
  ADMIN_FIELD_CONTROL,
} from "@/features/admin/components/admin-field";
import { useFocusExpandContext } from "@/hooks/use-focus-expand";
import { ProfileAvatarField } from "./profile-avatar-field";
import { cn } from "@/lib/utils";
import type { UserData } from "@/types/data";

interface Props {
  data: UserData;
}

export function AdminProfilePage({ data }: Props) {
  const [form, setForm] = useState(data);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [message, setMessage] = useState("");

  function update(path: string, value: string | string[]) {
    setForm((prev) => {
      const copy = structuredClone(prev);
      const keys = path.split(".");
      let obj: Record<string, unknown> = copy as unknown as Record<
        string,
        unknown
      >;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]] as Record<string, unknown>;
      }
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/config/userData", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: form }),
      });
      setMessage(res.ok ? "Saved successfully!" : "Failed to save.");
    } catch {
      setMessage("An error occurred.");
    }
    setSaving(false);
  }

  // Remove the saved override so the whole app falls back to the current/default
  // values, then reload to pull those defaults back into the form.
  async function resetToDefaults() {
    setResetting(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/config/userData", {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("Reset to defaults. Reloading…");
        window.location.reload();
        return;
      }
      setMessage("Failed to reset.");
    } catch {
      setMessage("An error occurred.");
    }
    setResetting(false);
    setConfirmReset(false);
  }

  return (
    <AdminLayout title="Profile & Hero">
      {/* Shared focus-expand scope: any AdminInput/animated field inside lifts and
          scales above the blur backdrop on focus — same UX as the projects form. */}
      <AdminFocusScope className="w-full max-w-5xl space-y-8">
        {/* Profile photo — header avatar + social share cards. */}
        <Section title="Profile Photo">
          <ProfileAvatarField
            value={form.avatarUrl ?? ""}
            onChange={(url) => update("avatarUrl", url)}
          />
          <p className="text-xs text-light-400">
            Shown as the site header avatar and in link share previews. Upload or
            pick an existing image, optionally remove the background and set a
            theme-color backdrop. If left empty, the default headshot is used.
          </p>
        </Section>

        <Section title="Basic Information">
          <AdminInput
            label="Name"
            required
            value={form.name}
            onChange={(v) => update("name", v)}
          />
          <AdminInput
            label="Designation"
            required
            value={form.designation}
            onChange={(v) => update("designation", v)}
          />
          <AdminInput
            label="Email"
            required
            value={form.email}
            onChange={(v) => update("email", v)}
          />
          <AdminInput
            label="Phone"
            value={form.phone}
            onChange={(v) => update("phone", v)}
          />
          <AdminInput
            label="Address"
            value={form.address}
            onChange={(v) => update("address", v)}
          />
          <AdminInput
            label="GitHub Username"
            value={form.githubUsername}
            onChange={(v) => update("githubUsername", v)}
          />
          <AdminInput
            label="Resume URL"
            value={form.resumeUrl}
            onChange={(v) => update("resumeUrl", v)}
          />
        </Section>

        <Section title="Social Links">
          <AdminInput
            label="LinkedIn"
            icon={<RiLinkedinFill className="size-4" />}
            value={form.socialLinks.linkedin}
            onChange={(v) => update("socialLinks.linkedin", v)}
          />
          <AdminInput
            label="GitHub"
            icon={<RiGithubFill className="size-4" />}
            value={form.socialLinks.github}
            onChange={(v) => update("socialLinks.github", v)}
          />
          <AdminInput
            label="YouTube"
            icon={<RiYoutubeFill className="size-4" />}
            value={form.socialLinks.youtube}
            onChange={(v) => update("socialLinks.youtube", v)}
          />
        </Section>

        <Section title="Hero Section">
          <AdminInput
            label="Hero Phrase"
            required
            value={form.hero.phrase}
            onChange={(v) => update("hero.phrase", v)}
          />
        </Section>

        <Section title="About Section">
          <AdminInput
            label="About Title"
            required
            value={form.about.title}
            onChange={(v) => update("about.title", v)}
          />
          <AdminInput
            label="Current Project"
            value={form.about.current_project}
            onChange={(v) => update("about.current_project", v)}
          />
          <AdminInput
            label="Current Project URL"
            value={form.about.current_project_url}
            onChange={(v) => update("about.current_project_url", v)}
          />
          <TextArrayField
            label="Description Paragraphs"
            required
            value={form.about.description}
            onChange={(v) => update("about.description", v)}
          />
        </Section>

        {/* Info page sidebar — the Contact and Job Opportunities blocks shown on
            the public /info page. */}
        <Section title="Info Page — Contact & Job Opportunities">
          <p className="text-xs text-light-400">
            Shown in the sidebar of your public /info page. In the body, wrap the
            link text in [brackets] to make it an inline link to your contact
            page — e.g. “shoot me an [email] and I&apos;ll reply”.
          </p>

          <AdminInput
            label="Contact Heading"
            required
            value={form.info.contact.heading}
            onChange={(v) => update("info.contact.heading", v)}
          />
          <AdminTextarea
            label="Contact Body"
            required
            value={form.info.contact.body}
            onChange={(v) => update("info.contact.body", v)}
          />

          <AdminInput
            label="Job Opportunities Heading"
            required
            value={form.info.jobOpportunities.heading}
            onChange={(v) => update("info.jobOpportunities.heading", v)}
          />
          <AdminTextarea
            label="Job Opportunities Body"
            required
            value={form.info.jobOpportunities.body}
            onChange={(v) => update("info.jobOpportunities.body", v)}
          />
        </Section>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-success px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-success-600 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          {confirmReset ? (
            <div className="relative z-50 flex flex-wrap items-center gap-2 rounded-lg border border-dark-600 bg-dark-500 px-3 py-2">
              <span className="text-sm text-light-400">
                Reset all fields to their defaults and remove your saved changes?
              </span>
              <button
                onClick={resetToDefaults}
                disabled={resetting}
                className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-white hover:bg-secondary/80 disabled:opacity-50"
              >
                {resetting ? "Resetting..." : "Yes, reset"}
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-2 text-sm text-light-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="rounded-lg border border-secondary px-6 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-secondary hover:text-white"
            >
              Reset to Defaults
            </button>
          )}

          {message && (
            <p
              className={cn(
                "text-sm",
                message.includes("success") || message.includes("Reset")
                  ? "text-success"
                  : "text-error",
              )}
            >
              {message}
            </p>
          )}
        </div>
      </AdminFocusScope>
    </AdminLayout>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dark-600 bg-dark-400 p-6">
      <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// A single label above a list of paragraph textareas, each of which animates
// on focus through the shared focus-expand scope (same as the AdminInputs).
function TextArrayField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  required?: boolean;
}) {
  return (
    <div className="flex w-full flex-col gap-1">
      <label className="text-sm font-medium text-white">
        {label}
        {required ? (
          <span className="ml-0.5 text-red-500">*</span>
        ) : (
          <span className="ml-1 font-normal text-light-400">(optional)</span>
        )}
      </label>
      {value.map((item, i) => (
        <ParagraphRow
          key={i}
          value={item}
          onChange={(v) => {
            const next = [...value];
            next[i] = v;
            onChange(next);
          }}
          onRemove={() => onChange(value.filter((_, j) => j !== i))}
        />
      ))}
      <button
        onClick={() => onChange([...value, ""])}
        className="self-start text-sm text-secondary hover:text-secondary/80"
      >
        + Add paragraph
      </button>
    </div>
  );
}

// One paragraph textarea wired to the shared focus-expand context so it lifts,
// scales, and dims its siblings exactly like the AdminInput fields.
function ParagraphRow({
  value,
  onChange,
  onRemove,
}: {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}) {
  const id = useId();
  const focus = useFocusExpandContext();
  const focused = focus?.isFocused(id) ?? false;
  const dimmed = focus?.isDimmed(id) ?? false;
  const fp = focus?.getFocusProps(id);
  return (
    <motion.div
      animate={{ scale: focused ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className={cn(
        "mb-2 flex gap-2",
        focused && "relative z-50",
        dimmed && "opacity-50 blur-[2px]",
      )}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={fp?.onFocus}
        onBlur={fp?.onBlur}
        rows={3}
        className={cn(
          ADMIN_FIELD_CONTROL,
          "flex-1",
          focused && "ring-1 ring-secondary/50",
        )}
      />
      <button
        onClick={onRemove}
        className="px-2 text-sm text-error hover:text-error-600"
      >
        Remove
      </button>
    </motion.div>
  );
}
