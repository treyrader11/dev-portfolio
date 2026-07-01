import { useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/features/admin/components/admin-layout";
import { type ExperienceItem, emptyExperience } from "../types";

interface Props {
  // null => creating a new experience
  experience: ExperienceItem | null;
}

export function ExperienceDetailPage({ experience }: Props) {
  const router = useRouter();
  const isNew = !experience;
  const [form, setForm] = useState(
    experience
      ? {
          title: experience.title,
          company: experience.company,
          iconUrl: experience.iconUrl,
          iconBg: experience.iconBg,
          date: experience.date,
          websiteUrl: experience.websiteUrl,
          points: experience.points.length ? experience.points : [""],
          sortOrder: experience.sortOrder,
        }
      : emptyExperience,
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const res = await fetch(
      isNew
        ? "/api/admin/experiences"
        : `/api/admin/experiences/${experience.id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      },
    );
    setSaving(false);
    if (res.ok) router.push("/admin/experience");
  }

  const title = isNew
    ? "New Experience"
    : experience.company || experience.title || "Experience";

  return (
    <AdminLayout
      title={title}
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Experience", href: "/admin/experience" },
        { label: isNew ? "New" : experience.company },
      ]}
    >
      <div className="max-w-3xl">
        <div className="bg-dark-400 rounded-lg border border-dark-600 p-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Title/Role"
              value={form.title}
              onChange={(v) => setForm({ ...form, title: v })}
            />
            <Input
              label="Company"
              value={form.company}
              onChange={(v) => setForm({ ...form, company: v })}
            />
            <Input
              label="Date Range"
              value={form.date}
              onChange={(v) => setForm({ ...form, date: v })}
            />
            <Input
              label="Website URL"
              value={form.websiteUrl}
              onChange={(v) => setForm({ ...form, websiteUrl: v })}
            />
            <Input
              label="Icon URL"
              value={form.iconUrl}
              onChange={(v) => setForm({ ...form, iconUrl: v })}
            />
            <Input
              label="Icon Background"
              value={form.iconBg}
              onChange={(v) => setForm({ ...form, iconBg: v })}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-white mb-1">
              Points
            </label>
            {form.points.map((point, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={point}
                  onChange={(e) => {
                    const next = [...form.points];
                    next[i] = e.target.value;
                    setForm({ ...form, points: next });
                  }}
                  className="flex-1 px-3 py-2 border border-dark-600 rounded-lg text-sm"
                />
                <button
                  onClick={() =>
                    setForm({
                      ...form,
                      points: form.points.filter((_, j) => j !== i),
                    })
                  }
                  className="text-red-400 text-sm px-2 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => setForm({ ...form, points: [...form.points, ""] })}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              + Add point
            </button>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-secondary text-white text-sm font-medium rounded-lg hover:bg-secondary/80 disabled:opacity-50"
            >
              {saving ? "Saving..." : isNew ? "Create" : "Save"}
            </button>
            <button
              onClick={() => router.push("/admin/experience")}
              className="px-4 py-2 text-light-400 text-sm hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-dark-600 rounded-lg text-sm"
      />
    </div>
  );
}
