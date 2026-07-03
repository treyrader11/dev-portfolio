import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { RiAddLine, RiCheckLine, RiCloseLine } from "react-icons/ri";
import AdminLayout from "@/features/admin/components/admin-layout";
import { IconUploadField } from "@/features/admin/components/icon-upload-field";
import { TechStackField } from "./tech-stack-field";
import { TagInputField, type Suggestion } from "./tag-input-field";
import { CategoryMultiField } from "./category-multi-field";
import {
  AdminInput,
  AdminTextarea,
  ADMIN_CONTROL,
} from "@/features/admin/components/admin-field";
import { cn, resolveImageSrc, slugify } from "@/lib/utils";
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
          tags: project.tags.filter(Boolean),
          category: project.category,
          technologyFeature: project.technologyFeature.filter(Boolean),
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
          isSlider: project.isSlider,
          sliderOrder: project.sliderOrder,
        }
      : {
          ...emptyProject,
          tags: [] as string[],
          technologyFeature: [] as string[],
        },
  );
  const [saving, setSaving] = useState(false);

  // Existing tag + technology-feature values, used to suggest as the user types.
  const [tagOptions, setTagOptions] = useState<Suggestion[]>([]);
  const [featureOptions, setFeatureOptions] = useState<Suggestion[]>([]);
  useEffect(() => {
    fetch("/api/admin/projects/meta")
      .then((r) => (r.ok ? r.json() : { tags: [], features: [] }))
      .then((data: { tags: Suggestion[]; features: Suggestion[] }) => {
        setTagOptions(data.tags ?? []);
        setFeatureOptions(data.features ?? []);
      })
      .catch(() => {});
  }, []);

  // Dirty-tracking: any change reveals the fixed save bar.
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
  const shots = form.image.shots ?? [];
  // Images the admin can pick to show inside the Safari frame on the public
  // project page: the poster plus every product shot (de-duped, order kept).
  const safariOptions = Array.from(
    new Set([form.projectImage, ...shots].filter(Boolean)),
  );
  const safariSelected = form.image.safari ?? "";

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
        <div className="bg-dark-400 rounded-lg border border-dark-600 p-4 sm:p-6 space-y-3">
          <AdminInput
            label="Title"
            required
            value={form.title}
            onChange={(v) => setForm({ ...form, title: v })}
          />
          <AdminInput
            label="Category"
            required
            value={form.category}
            onChange={(v) => setForm({ ...form, category: v })}
          />
          <AdminInput
            label="Video Key"
            required
            value={form.videoKey}
            onChange={(v) => setForm({ ...form, videoKey: v })}
          />

          <IconUploadField
            label="Logo"
            value={form.image.icon}
            onChange={(v) =>
              setForm((f) => ({ ...f, image: { ...f.image, icon: v } }))
            }
          />

          <TechStackField
            label="Tech Stack"
            value={form.techImage}
            onChange={(v) => setForm((f) => ({ ...f, techImage: v }))}
            onSelectName={(name) => setForm((f) => ({ ...f, stack: name }))}
          />
          <AdminInput
            label="Stack Text"
            value={form.stack}
            onChange={(v) => setForm({ ...form, stack: v })}
          />

          <AdminInput
            label="Color"
            value={form.color}
            onChange={(v) => setForm({ ...form, color: v })}
          />

          <IconUploadField
            label="Project Poster"
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

          {/* Use this project's poster in the home page sliding-images strip.
              Reorder the strip in the Projects list's "Sliding Images" section. */}
          <label className="flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={form.isSlider}
              onChange={(e) => setForm({ ...form, isSlider: e.target.checked })}
              className="size-4 accent-success"
            />
            Show poster in home sliding images
          </label>

          {/* Product Shots — managed on a dedicated screen. */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-white">Product Shots</label>
            <p className="mb-2 text-xs text-light-400">
              Landscape screenshots shown inside a laptop frame. Add as many as
              you like and reorder them.
            </p>

            {shots.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {shots.map((shot) => (
                  <div
                    key={shot}
                    className="relative h-12 w-20 overflow-hidden rounded border border-dark-600 bg-dark-600"
                  >
                    <Image
                      src={resolveImageSrc(shot)}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {isNew ? (
              <div className="space-y-1">
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-1.5 rounded-lg border border-dark-600 px-4 py-2 text-sm text-light-400 opacity-60"
                >
                  <RiAddLine className="size-4" /> Add product shots
                </button>
                <p className="text-xs text-light-400">
                  Save the project first to add product shots.
                </p>
              </div>
            ) : (
              <Link
                href={`/admin/projects/${slugify(project.title)}/product-shots`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-dark-600 px-4 py-2 text-sm text-white transition-colors hover:border-secondary/60"
              >
                <RiAddLine className="size-4" />
                {shots.length ? "Manage product shots" : "Add product shots"}
              </Link>
            )}
          </div>

          {/* Safari Frame Image — pick which image renders inside the Safari
              browser mockup on the public project page. Unset → the project
              video plays there instead. */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-white">
              Safari Frame Image
            </label>
            <p className="mb-2 text-xs text-light-400">
              Choose one of this project&apos;s images to display inside the
              Safari browser frame on the project page. Leave unset to fall back
              to the project video.
            </p>
            {safariOptions.length ? (
              <div className="flex flex-wrap gap-2">
                {safariOptions.map((img) => {
                  const selected = safariSelected === img;
                  return (
                    <button
                      type="button"
                      key={img}
                      // Click to select; click the selected one again to clear
                      // it (fall back to the video).
                      onClick={() =>
                        setForm({
                          ...form,
                          image: {
                            ...form.image,
                            safari: selected ? "" : img,
                          },
                        })
                      }
                      className={cn(
                        "relative h-16 w-28 overflow-hidden rounded border-2 transition-colors",
                        selected
                          ? "border-secondary"
                          : "border-dark-600 hover:border-secondary/50",
                      )}
                    >
                      <Image
                        fill
                        alt=""
                        src={resolveImageSrc(img)}
                        className="object-cover"
                        sizes="112px"
                      />
                      {selected && (
                        <span className="absolute right-1 top-1 rounded bg-secondary p-0.5 text-white">
                          <RiCheckLine className="size-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-light-400">
                Add a project poster or product shots first.
              </p>
            )}
          </div>

          <AdminInput
            label="YouTube Link"
            value={form.youtubeLink}
            onChange={(v) => setForm({ ...form, youtubeLink: v })}
          />
          <AdminInput
            label="GitHub Link"
            value={form.githubLink}
            onChange={(v) => setForm({ ...form, githubLink: v })}
          />
          <AdminInput
            label="Website URL"
            value={form.websiteUrl}
            onChange={(v) => setForm({ ...form, websiteUrl: v })}
          />
          <AdminInput
            label="Project Video"
            value={form.projectVideo}
            onChange={(v) => setForm({ ...form, projectVideo: v })}
          />
          <AdminInput
            label="Sort Order"
            value={String(form.sortOrder)}
            onChange={(v) => setForm({ ...form, sortOrder: Number(v) || 0 })}
          />

          <AdminTextarea
            label="Description"
            value={form.description}
            onChange={(v) => setForm({ ...form, description: v })}
            rows={4}
          />

          <TagInputField
            label="Tags"
            value={form.tags}
            suggestions={tagOptions}
            onChange={(v) => setForm({ ...form, tags: v })}
          />
          <CategoryMultiField
            label="Technology Features"
            value={form.technologyFeature}
            options={featureOptions}
            onChange={(v) => setForm({ ...form, technologyFeature: v })}
          />

          {/* Environment — the "Frontend" / "Backend" tech lists shown under
              Environment on the public project page. One entry per line. */}
          <div className="flex flex-col gap-4 rounded-lg border border-dark-600 p-4">
            <p className="text-sm font-medium text-white">Environment</p>
            <StringListField
              label="Frontend"
              value={form.env.frontend ?? []}
              placeholder="e.g. Next.js"
              onChange={(v) =>
                setForm({ ...form, env: { ...form.env, frontend: v } })
              }
            />
            <StringListField
              label="Backend"
              value={form.env.backend ?? []}
              placeholder="e.g. Node.js"
              onChange={(v) =>
                setForm({ ...form, env: { ...form.env, backend: v } })
              }
            />
          </div>

          {/* Source code — the download/repo links shown under Source code on
              the public project page. Leave blank to hide a link. */}
          <div className="flex flex-col gap-4 rounded-lg border border-dark-600 p-4">
            <p className="text-sm font-medium text-white">Source Code Links</p>
            <AdminInput
              label="Frontend URL"
              value={form.downloadLinks.frontend ?? ""}
              onChange={(v) =>
                setForm({
                  ...form,
                  downloadLinks: { ...form.downloadLinks, frontend: v },
                })
              }
            />
            <AdminInput
              label="Backend URL"
              value={form.downloadLinks.backend ?? ""}
              onChange={(v) =>
                setForm({
                  ...form,
                  downloadLinks: { ...form.downloadLinks, backend: v },
                })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-white">Visibility</label>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
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
      </div>

      {/* Save bar — springs up when a change is made. */}
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

// A casing-preserving list editor: one text input per entry with a remove
// button, plus an "Add" button. Used for the Environment tech lists (unlike
// TagInputField, which lowercases and #-prefixes values for tags).
function StringListField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string[];
  placeholder?: string;
  onChange: (value: string[]) => void;
}) {
  const items = value.length ? value : [];

  const setAt = (index: number, next: string) =>
    onChange(items.map((item, i) => (i === index ? next : item)));
  const removeAt = (index: number) =>
    onChange(items.filter((_, i) => i !== index));
  const add = () => onChange([...items, ""]);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white">{label}</label>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={item}
            placeholder={placeholder}
            onChange={(e) => setAt(i, e.target.value)}
            className={cn(ADMIN_CONTROL)}
          />
          <button
            type="button"
            aria-label={`Remove ${label} entry ${i + 1}`}
            onClick={() => removeAt(i)}
            className="shrink-0 rounded-lg border border-dark-600 p-2 text-light-400 transition-colors hover:border-red-500/60 hover:text-red-500"
          >
            <RiCloseLine className="size-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-dark-600 px-3 py-1.5 text-sm text-white transition-colors hover:border-secondary/60"
      >
        <RiAddLine className="size-4" />
        Add {label.toLowerCase()}
      </button>
    </div>
  );
}

