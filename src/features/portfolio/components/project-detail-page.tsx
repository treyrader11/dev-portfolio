import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import AdminLayout from "@/features/admin/components/admin-layout";
import { IconUploadField } from "@/features/admin/components/icon-upload-field";
import { TechStackField } from "./tech-stack-field";
import { type ProjectItem, emptyProject } from "../types";

interface Props {
  // null => creating a new project
  project: ProjectItem | null;
}

export function ProjectDetailPage({ project }: Props) {
  const router = useRouter();
  const isNew = !project;

  const [form, setForm] = useState(() =>
    project
      ? {
          title: project.title,
          description: project.description,
          color: project.color,
          isPriority: project.isPriority,
          videoKey: project.videoKey,
          stack: project.stack,
          techImage: project.techImage,
          tags: project.tags.length ? project.tags : [""],
          category: project.category,
          technologyFeature: project.technologyFeature.length
            ? project.technologyFeature
            : [""],
          packages:
            (project.packages as typeof emptyProject.packages) ??
            emptyProject.packages,
          env: (project.env as typeof emptyProject.env) ?? emptyProject.env,
          youtubeLink: project.youtubeLink,
          githubLink: project.githubLink,
          downloadLinks:
            (project.downloadLinks as typeof emptyProject.downloadLinks) ??
            emptyProject.downloadLinks,
          projectImage: project.projectImage,
          projectVideo: project.projectVideo,
          image: {
            ...emptyProject.image,
            ...((project.image as Partial<typeof emptyProject.image>) ?? {}),
          },
          websiteUrl: project.websiteUrl,
          isRecent: project.isRecent,
          sortOrder: project.sortOrder,
        }
      : emptyProject,
  );
  const [saving, setSaving] = useState(false);

  // Dirty-tracking: any change reveals the fixed save bar. The initial snapshot
  // is captured once, on the first render.
  const snapshot = JSON.stringify(form);
  const initialSnapshot = useRef<string | undefined>(undefined);
  if (initialSnapshot.current === undefined) initialSnapshot.current = snapshot;
  const dirty = snapshot !== initialSnapshot.current;

  async function handleSave() {
    setSaving(true);
    const res = await fetch(
      isNew ? "/api/admin/projects" : `/api/admin/projects/${project.id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      },
    );
    setSaving(false);
    if (res.ok) router.push("/admin/projects");
  }

  const title = isNew ? "New Project" : project.title || "Project";

  return (
    <AdminLayout
      title={title}
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Projects", href: "/admin/projects" },
        { label: isNew ? "New" : project.title },
      ]}
    >
      <div className="w-full max-w-3xl pb-24">
        {/* One column — every field stacks. */}
        <div className="bg-dark-400 rounded-lg border border-dark-600 p-6 space-y-4">
          <IconUploadField
            label="Icon"
            value={form.image.icon}
            onChange={(v) =>
              setForm((f) => ({ ...f, image: { ...f.image, icon: v } }))
            }
          />

          <Input
            label="Title"
            value={form.title}
            onChange={(v) => setForm({ ...form, title: v })}
          />
          <Input
            label="Category"
            value={form.category}
            onChange={(v) => setForm({ ...form, category: v })}
          />

          <TechStackField
            label="Tech Stack"
            value={form.techImage}
            onChange={(v) => setForm((f) => ({ ...f, techImage: v }))}
            onSelectName={(name) => setForm((f) => ({ ...f, stack: name }))}
          />
          <Input
            label="Stack (display text)"
            value={form.stack}
            onChange={(v) => setForm({ ...form, stack: v })}
          />

          <Input
            label="Color"
            value={form.color}
            onChange={(v) => setForm({ ...form, color: v })}
          />
          <Input
            label="Video Key"
            value={form.videoKey}
            onChange={(v) => setForm({ ...form, videoKey: v })}
          />

          <IconUploadField
            label="Project Image"
            value={form.projectImage}
            previewBg="#141516"
            aspect={16 / 9}
            onChange={(v) =>
              setForm((f) => ({
                ...f,
                projectImage: v,
                // Keep the main product shot (image.src) in sync with the upload.
                image: { ...f.image, src: v },
              }))
            }
          />

          <Input
            label="YouTube Link"
            value={form.youtubeLink}
            onChange={(v) => setForm({ ...form, youtubeLink: v })}
          />
          <Input
            label="GitHub Link"
            value={form.githubLink}
            onChange={(v) => setForm({ ...form, githubLink: v })}
          />
          <Input
            label="Website URL"
            value={form.websiteUrl}
            onChange={(v) => setForm({ ...form, websiteUrl: v })}
          />
          <Input
            label="Project Video"
            value={form.projectVideo}
            onChange={(v) => setForm({ ...form, projectVideo: v })}
          />
          <Input
            label="Sort Order"
            value={String(form.sortOrder)}
            onChange={(v) => setForm({ ...form, sortOrder: Number(v) || 0 })}
          />

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-dark-600 rounded-lg text-sm"
            />
          </div>

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

          <div className="flex gap-6 pt-1">
            <label className="flex items-center gap-2 text-sm text-white">
              <input
                type="checkbox"
                checked={form.isPriority}
                onChange={(e) =>
                  setForm({ ...form, isPriority: e.target.checked })
                }
                className="size-4 accent-secondary"
              />
              Priority
            </label>
            <label className="flex items-center gap-2 text-sm text-white">
              <input
                type="checkbox"
                checked={form.isRecent}
                onChange={(e) =>
                  setForm({ ...form, isRecent: e.target.checked })
                }
                className="size-4 accent-success"
              />
              Show in Latest Work
            </label>
          </div>
        </div>
      </div>

      {/* Save bar — hidden off the bottom of the screen until a change is made,
          then it springs up into view. */}
      <motion.div
        initial={false}
        animate={{ y: dirty ? "0%" : "110%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-dark-600 bg-dark-500/95 backdrop-blur"
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4">
          <span className="text-sm text-light-400">You have unsaved changes</span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/projects")}
              className="px-4 py-2 text-sm text-light-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success-600 disabled:opacity-50"
            >
              {saving ? "Saving..." : isNew ? "Create" : "Save"}
            </button>
          </div>
        </div>
      </motion.div>
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
      <label className="block text-sm font-medium text-white mb-1">
        {label}
      </label>
      {value.map((item, i) => (
        <div key={i} className="flex gap-2 mb-1">
          <input
            value={item}
            onChange={(e) => {
              const next = [...value];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="flex-1 px-3 py-1.5 border border-dark-600 rounded-lg text-sm"
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            className="text-error text-sm px-1 hover:text-error-600"
          >
            x
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="text-sm text-blue-400 hover:text-blue-300"
      >
        + Add
      </button>
    </div>
  );
}
