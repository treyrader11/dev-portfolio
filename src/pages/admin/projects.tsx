import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import type { GetServerSideProps } from "next";
import type { Project as PrismaProject } from "@prisma/client";

type ProjectItem = Omit<PrismaProject, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

interface Props {
  projects: ProjectItem[];
}

const emptyProject = {
  title: "",
  description: "",
  color: "#000000",
  isPriority: false,
  videoKey: "",
  stack: "",
  techImage: "",
  tags: [""],
  category: "",
  technologyFeature: [""],
  packages: { frontend: [], backend: [] },
  env: { frontend: [], backend: [] },
  youtubeLink: "",
  githubLink: "",
  downloadLinks: { frontend: "", backend: "" },
  projectImage: "",
  projectVideo: "",
  image: { isPriority: false, src: "" },
  websiteUrl: "",
  isRecent: false,
  sortOrder: 0,
};

export default function AdminProjects({ projects: initial }: Props) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyProject);
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    setSaving(true);
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const created = await res.json();
      setItems([...items, created]);
      setCreating(false);
      setForm(emptyProject);
    }
    setSaving(false);
  }

  async function handleUpdate() {
    if (!editing) return;
    setSaving(true);
    const res = await fetch(`/api/admin/projects/${editing.id}`, {
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
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems(items.filter((i) => i.id !== id));
    }
  }

  function startEdit(item: ProjectItem) {
    setEditing(item);
    setCreating(false);
    setForm({
      title: item.title,
      description: item.description,
      color: item.color,
      isPriority: item.isPriority,
      videoKey: item.videoKey,
      stack: item.stack,
      techImage: item.techImage,
      tags: item.tags,
      category: item.category,
      technologyFeature: item.technologyFeature,
      packages: (item.packages as typeof emptyProject.packages) ?? emptyProject.packages,
      env: (item.env as typeof emptyProject.env) ?? emptyProject.env,
      youtubeLink: item.youtubeLink,
      githubLink: item.githubLink,
      downloadLinks: (item.downloadLinks as typeof emptyProject.downloadLinks) ?? emptyProject.downloadLinks,
      projectImage: item.projectImage,
      projectVideo: item.projectVideo,
      image: (item.image as typeof emptyProject.image) ?? emptyProject.image,
      websiteUrl: item.websiteUrl,
      isRecent: item.isRecent,
      sortOrder: item.sortOrder,
    });
  }

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setForm(emptyProject);
  }

  const showForm = creating || editing;

  return (
    <AdminLayout title="Projects">
      <div className="max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-500">{items.length} projects</p>
          <button
            onClick={startCreate}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Add Project
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {creating ? "New Project" : "Edit Project"}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
              <Input label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
              <Input label="Stack" value={form.stack} onChange={(v) => setForm({ ...form, stack: v })} />
              <Input label="Color" value={form.color} onChange={(v) => setForm({ ...form, color: v })} />
              <Input label="Video Key" value={form.videoKey} onChange={(v) => setForm({ ...form, videoKey: v })} />
              <Input label="Tech Image" value={form.techImage} onChange={(v) => setForm({ ...form, techImage: v })} />
              <Input label="YouTube Link" value={form.youtubeLink} onChange={(v) => setForm({ ...form, youtubeLink: v })} />
              <Input label="GitHub Link" value={form.githubLink} onChange={(v) => setForm({ ...form, githubLink: v })} />
              <Input label="Website URL" value={form.websiteUrl} onChange={(v) => setForm({ ...form, websiteUrl: v })} />
              <Input label="Project Image" value={form.projectImage} onChange={(v) => setForm({ ...form, projectImage: v })} />
              <Input label="Project Video" value={form.projectVideo} onChange={(v) => setForm({ ...form, projectVideo: v })} />
              <Input label="Sort Order" value={String(form.sortOrder)} onChange={(v) => setForm({ ...form, sortOrder: Number(v) })} />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <ArrayField
                label="Tags"
                value={form.tags}
                onChange={(v) => setForm({ ...form, tags: v })}
              />
              <ArrayField
                label="Technology Features"
                value={form.technologyFeature}
                onChange={(v) => setForm({ ...form, technologyFeature: v })}
              />
            </div>
            <div className="flex gap-4 mt-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isPriority}
                  onChange={(e) => setForm({ ...form, isPriority: e.target.checked })}
                />
                Priority
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isRecent}
                  onChange={(e) => setForm({ ...form, isRecent: e.target.checked })}
                />
                Recent
              </label>
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
                onClick={() => { setCreating(false); setEditing(null); }}
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
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  {item.isPriority && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                      Priority
                    </span>
                  )}
                  {item.isRecent && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                      Recent
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {item.category} &middot; {item.stack}
                </p>
                <div className="flex gap-1 mt-2">
                  {item.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
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
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
      />
    </div>
  );
}

function ArrayField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {value.map((item, i) => (
        <div key={i} className="flex gap-2 mb-1">
          <input
            value={item}
            onChange={(e) => {
              const next = [...value];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          />
          <button
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            className="text-red-500 text-sm"
          >
            x
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...value, ""])} className="text-sm text-blue-600">
        + Add
      </button>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session?.user?.isAdmin) {
    return { redirect: { destination: "/admin/signin", permanent: false } };
  }

  const projects = await prisma.project.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return {
    props: { projects: JSON.parse(JSON.stringify(projects)) },
  };
};
