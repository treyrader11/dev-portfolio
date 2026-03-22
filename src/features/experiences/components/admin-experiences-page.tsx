import { useState } from "react";
import AdminLayout from "@/features/admin/components/admin-layout";
import { type ExperienceItem, emptyExperience } from "../types";

interface Props {
  experiences: ExperienceItem[];
}

export function AdminExperiencesPage({ experiences: initial }: Props) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<ExperienceItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyExperience);
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    setSaving(true);
    const res = await fetch("/api/admin/experiences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const created = await res.json();
      setItems([...items, created]);
      setCreating(false);
      setForm(emptyExperience);
    }
    setSaving(false);
  }

  async function handleUpdate() {
    if (!editing) return;
    setSaving(true);
    const res = await fetch(`/api/admin/experiences/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems(items.map((i) => (i.id === updated.id ? updated : i)));
      setEditing(null);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this experience?")) return;
    const res = await fetch(`/api/admin/experiences/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setItems(items.filter((i) => i.id !== id));
    }
  }

  function startEdit(item: ExperienceItem) {
    setEditing(item);
    setCreating(false);
    setForm({
      title: item.title,
      company: item.company,
      iconUrl: item.iconUrl,
      iconBg: item.iconBg,
      date: item.date,
      websiteUrl: item.websiteUrl,
      points: item.points,
      sortOrder: item.sortOrder,
    });
  }

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setForm(emptyExperience);
  }

  const showForm = creating || editing;

  return (
    <AdminLayout title="Experiences">
      <div className="max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-500">{items.length} experiences</p>
          <button
            onClick={startCreate}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Add Experience
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {creating ? "New Experience" : "Edit Experience"}
            </h3>
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
              <Input
                label="Sort Order"
                value={String(form.sortOrder)}
                onChange={(v) => setForm({ ...form, sortOrder: Number(v) })}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={() =>
                      setForm({
                        ...form,
                        points: form.points.filter((_, j) => j !== i),
                      })
                    }
                    className="text-red-500 text-sm px-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setForm({ ...form, points: [...form.points, ""] })
                }
                className="text-sm text-blue-600"
              >
                + Add point
              </button>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={creating ? handleCreate : handleUpdate}
                disabled={saving}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? "Saving..." : creating ? "Create" : "Update"}
              </button>
              <button
                onClick={() => {
                  setCreating(false);
                  setEditing(null);
                }}
                className="px-4 py-2 text-gray-600 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-start"
            >
              <div>
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">
                  {item.company} &middot; {item.date}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {item.points.length} points
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(item)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
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
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
      />
    </div>
  );
}
