import { useState } from "react";
import AdminLayout from "@/features/admin/components/admin-layout";
import { IconUploadField } from "@/features/admin/components/icon-upload-field";
import type { UserData } from "@/types/data";

interface Props {
  data: UserData;
}

export function AdminProfilePage({ data }: Props) {
  const [form, setForm] = useState(data);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function update(path: string, value: string | string[]) {
    setForm((prev) => {
      const copy = structuredClone(prev);
      const keys = path.split(".");
      let obj: Record<string, unknown> = copy as unknown as Record<string, unknown>;
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
      if (res.ok) {
        setMessage("Saved successfully!");
      } else {
        setMessage("Failed to save.");
      }
    } catch {
      setMessage("An error occurred.");
    }
    setSaving(false);
  }

  return (
    <AdminLayout title="Profile & Hero">
      <div className="max-w-3xl space-y-8">
        {/* Profile photo — used for the header avatar and social share cards.
            Square crop; leave empty to fall back to the default headshot. */}
        <Section title="Profile Photo">
          <IconUploadField
            label="Avatar"
            value={form.avatarUrl ?? ""}
            previewBg="#141516"
            aspect={1}
            folder="profile"
            onChange={(url) => update("avatarUrl", url)}
          />
          <p className="text-xs text-light-400">
            Shown as the site header avatar and in link share previews. If left
            empty, the default headshot is used.
          </p>
        </Section>

        {/* Basic info */}
        <Section title="Basic Information">
          <Field
            label="Name"
            value={form.name}
            onChange={(v) => update("name", v)}
          />
          <Field
            label="Designation"
            value={form.designation}
            onChange={(v) => update("designation", v)}
          />
          <Field
            label="Email"
            value={form.email}
            onChange={(v) => update("email", v)}
          />
          <Field
            label="Phone"
            value={form.phone}
            onChange={(v) => update("phone", v)}
          />
          <Field
            label="Address"
            value={form.address}
            onChange={(v) => update("address", v)}
          />
          <Field
            label="GitHub Username"
            value={form.githubUsername}
            onChange={(v) => update("githubUsername", v)}
          />
          <Field
            label="Resume URL"
            value={form.resumeUrl}
            onChange={(v) => update("resumeUrl", v)}
          />
        </Section>

        {/* Social links */}
        <Section title="Social Links">
          <Field
            label="LinkedIn"
            value={form.socialLinks.linkedin}
            onChange={(v) => update("socialLinks.linkedin", v)}
          />
          <Field
            label="GitHub"
            value={form.socialLinks.github}
            onChange={(v) => update("socialLinks.github", v)}
          />
          <Field
            label="YouTube"
            value={form.socialLinks.youtube}
            onChange={(v) => update("socialLinks.youtube", v)}
          />
        </Section>

        {/* Hero */}
        <Section title="Hero Section">
          <Field
            label="Hero Phrase"
            value={form.hero.phrase}
            onChange={(v) => update("hero.phrase", v)}
          />
        </Section>

        {/* About */}
        <Section title="About Section">
          <Field
            label="About Title"
            value={form.about.title}
            onChange={(v) => update("about.title", v)}
          />
          <Field
            label="Current Project"
            value={form.about.current_project}
            onChange={(v) => update("about.current_project", v)}
          />
          <Field
            label="Current Project URL"
            value={form.about.current_project_url}
            onChange={(v) => update("about.current_project_url", v)}
          />
          <TextArrayField
            label="Description Paragraphs"
            value={form.about.description}
            onChange={(v) => update("about.description", v)}
          />
          <TextArrayField
            label="Concise Description"
            value={form.about.description_concise}
            onChange={(v) => update("about.description_concise", v)}
          />
        </Section>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-2.5 bg-dark-600 text-white text-sm font-medium rounded-lg hover:bg-dark-600 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {message && (
            <p
              className={`text-sm ${message.includes("success") ? "text-green-400" : "text-red-400"}`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-dark-400 rounded-lg border border-dark-600 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-white">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-dark-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dark-600 focus:border-transparent"
      />
    </div>
  );
}

function TextArrayField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-white">
        {label}
      </label>
      {value.map((item, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <textarea
            value={item}
            onChange={(e) => {
              const next = [...value];
              next[i] = e.target.value;
              onChange(next);
            }}
            rows={3}
            className="flex-1 px-3 py-2 border border-dark-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dark-600 focus:border-transparent"
          />
          <button
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            className="px-2 text-red-500 hover:text-red-400 text-sm"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...value, ""])}
        className="text-sm text-blue-400 hover:text-blue-400"
      >
        + Add paragraph
      </button>
    </div>
  );
}
