import { useState } from "react";
import AdminLayout from "@/features/admin/components/admin-layout";
import { type SkillItem, emptySkill } from "../types";

interface Props {
  skills: SkillItem[];
}

export function AdminSkillsPage({ skills: initial }: Props) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<SkillItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptySkill);
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    setSaving(true);
    const res = await fetch("/api/admin/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const created = await res.json();
      setItems([...items, created]);
      setCreating(false);
      setForm(emptySkill);
    }
    setSaving(false);
  }

  async function handleUpdate() {
    if (!editing) return;
    setSaving(true);
    const res = await fetch(`/api/admin/skills/${editing.id}`, {
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
    if (!confirm("Delete this skill?")) return;
    const res = await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems(items.filter((i) => i.id !== id));
    }
  }

  function startEdit(item: SkillItem) {
    setEditing(item);
    setCreating(false);
    setForm({
      skillName: item.skillName,
      imageUrl: item.imageUrl,
      width: item.width,
      height: item.height,
      category: item.category,
      sortOrder: item.sortOrder,
    });
  }

  const showForm = creating || editing;

  return (
    <AdminLayout title="Skills">
      <div className="max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-light-400">{items.length} skills</p>
          <button
            onClick={() => { setCreating(true); setEditing(null); setForm(emptySkill); }}
            className="px-4 py-2 bg-dark-600 text-white text-sm font-medium rounded-lg hover:bg-dark-600"
          >
            Add Skill
          </button>
        </div>

        {showForm && (
          <div className="bg-dark-400 rounded-lg border border-dark-600 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {creating ? "New Skill" : "Edit Skill"}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">Skill Name</label>
                <input value={form.skillName} onChange={(e) => setForm({ ...form, skillName: e.target.value })} className="w-full px-3 py-2 border border-dark-600 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Image URL</label>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full px-3 py-2 border border-dark-600 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-dark-600 rounded-lg text-sm">
                  <option value="all">All</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="fullstack">Fullstack</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Sort Order</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-full px-3 py-2 border border-dark-600 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Width</label>
                <input type="number" value={form.width} onChange={(e) => setForm({ ...form, width: Number(e.target.value) })} className="w-full px-3 py-2 border border-dark-600 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Height</label>
                <input type="number" value={form.height} onChange={(e) => setForm({ ...form, height: Number(e.target.value) })} className="w-full px-3 py-2 border border-dark-600 rounded-lg text-sm" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={creating ? handleCreate : handleUpdate}
                disabled={saving}
                className="px-4 py-2 bg-dark-600 text-white text-sm font-medium rounded-lg hover:bg-dark-600 disabled:opacity-50"
              >
                {saving ? "Saving..." : creating ? "Create" : "Update"}
              </button>
              <button onClick={() => { setCreating(false); setEditing(null); }} className="px-4 py-2 text-light-400 text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <div key={item.id} className="bg-dark-400 rounded-lg border border-dark-600 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-secondary">{item.skillName}</h3>
                  <p className="text-xs text-light-400 mt-1">{item.category}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(item)} className="text-sm text-blue-400">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-sm text-red-400">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
