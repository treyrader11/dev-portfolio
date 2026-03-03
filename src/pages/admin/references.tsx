import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import type { GetServerSideProps } from "next";
import type { Reference as PrismaReference } from "@prisma/client";

type ReferenceItem = Omit<PrismaReference, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

interface Props {
  references: ReferenceItem[];
}

const emptyReference = {
  name: "",
  role: "",
  company: "",
  imageUrl: "",
  text: "",
  sortOrder: 0,
};

export default function AdminReferences({ references: initial }: Props) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<ReferenceItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyReference);
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    setSaving(true);
    const res = await fetch("/api/admin/references", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const created = await res.json();
      setItems([...items, created]);
      setCreating(false);
      setForm(emptyReference);
    }
    setSaving(false);
  }

  async function handleUpdate() {
    if (!editing) return;
    setSaving(true);
    const res = await fetch(`/api/admin/references/${editing.id}`, {
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
    if (!confirm("Delete this reference?")) return;
    const res = await fetch(`/api/admin/references/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems(items.filter((i) => i.id !== id));
    }
  }

  function startEdit(item: ReferenceItem) {
    setEditing(item);
    setCreating(false);
    setForm({
      name: item.name,
      role: item.role,
      company: item.company ?? "",
      imageUrl: item.imageUrl,
      text: item.text,
      sortOrder: item.sortOrder,
    });
  }

  const showForm = creating || editing;

  return (
    <AdminLayout title="References">
      <div className="max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-500">{items.length} references</p>
          <button
            onClick={() => { setCreating(true); setEditing(null); setForm(emptyReference); }}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
          >
            Add Reference
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {creating ? "New Reference" : "Edit Reference"}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Text</label>
              <textarea
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={creating ? handleCreate : handleUpdate}
                disabled={saving}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? "Saving..." : creating ? "Create" : "Update"}
              </button>
              <button onClick={() => { setCreating(false); setEditing(null); }} className="px-4 py-2 text-gray-600 text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.role}{item.company ? ` at ${item.company}` : ""}</p>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{item.text}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0 ml-4">
                <button onClick={() => startEdit(item)} className="text-sm text-blue-600">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-sm text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session?.user?.isAdmin) {
    return { redirect: { destination: "/admin/signin", permanent: false } };
  }

  const references = await prisma.reference.findMany({ orderBy: { sortOrder: "asc" } });
  return { props: { references: JSON.parse(JSON.stringify(references)) } };
};
