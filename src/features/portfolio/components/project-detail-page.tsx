import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { RiAddLine, RiCheckLine, RiCloseLine } from "react-icons/ri";
import AdminLayout from "@/features/admin/components/admin-layout";
import { AdminFocusScope } from "@/features/admin/components/admin-form";
import { IconUploadField } from "@/features/admin/components/icon-upload-field";
import { PasteDropzone } from "@/features/admin/components/paste-dropzone";
import { PreviewSheet } from "@/features/admin/components/preview-sheet";
import { TechStackField } from "./tech-stack-field";
import { TagInputField, type Suggestion } from "./tag-input-field";
import { CategoryMultiField } from "./category-multi-field";
import {
  AdminInput,
  AdminTextarea,
  ADMIN_FIELD_CONTROL,
} from "@/features/admin/components/admin-field";
import { useFocusExpandContext } from "@/hooks/use-focus-expand";
import CodeEditor from "@/components/CodeEditor";
import PackagesCodeBlock from "@/components/CodeBlock/PackagesCodeBlock";
import { EnvVarsField } from "./env-vars-field";
import {
  PackageAiAnalyzer,
  type PackageAnalysis,
} from "./package-ai-analyzer";
import { parsePackageDeps, isEnvEmpty, isPackagesEmpty } from "../lib/parse-config";
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

  // Which config preview sheet is open (null when closed).
  const [preview, setPreview] = useState<"env" | "packages" | null>(null);
  // Content mirrored into the Frontend package.json box after an AI analyze, so
  // the pasted package.json visibly shows up there too.
  const [pkgFrontendSeed, setPkgFrontendSeed] = useState<string>("");
  // Per-side package.json parse errors (invalid JSON), shown under each dropzone.
  const [pkgError, setPkgError] = useState<{
    frontend?: boolean;
    backend?: boolean;
  }>({});

  // Parse a pasted package.json (or bare deps object) into formatted lines for
  // the given side; empty input clears it, invalid JSON flags an error.
  function applyPackages(side: "frontend" | "backend", text: string) {
    if (!text.trim()) {
      setForm((f) => ({
        ...f,
        packages: { ...f.packages, [side]: [] },
      }));
      setPkgError((e) => ({ ...e, [side]: false }));
      return;
    }
    const lines = parsePackageDeps(text);
    if (lines) {
      setForm((f) => ({ ...f, packages: { ...f.packages, [side]: lines } }));
      setPkgError((e) => ({ ...e, [side]: false }));
    } else {
      setPkgError((e) => ({ ...e, [side]: true }));
    }
  }

  // Apply an AI package.json analysis: fill Filter Category, merge Tags and
  // Technology Features (never wiping manual entries), and set the parsed
  // frontend packages. All values stay editable afterwards.
  function applyAnalysis(result: PackageAnalysis) {
    const mergeUnique = (existing: string[], incoming: string[]) => {
      const seen = new Set(existing.map((s) => s.toLowerCase()));
      const merged = [...existing];
      for (const item of incoming) {
        if (item && !seen.has(item.toLowerCase())) {
          seen.add(item.toLowerCase());
          merged.push(item);
        }
      }
      return merged;
    };
    setForm((f) => ({
      ...f,
      category: result.filterCategory || f.category,
      tags: mergeUnique(f.tags.filter(Boolean), result.tags),
      technologyFeature: mergeUnique(
        f.technologyFeature.filter(Boolean),
        result.technologyFeatures,
      ),
      packages: {
        ...f.packages,
        frontend: result.packages.length
          ? result.packages
          : f.packages.frontend,
      },
    }));
    // Mirror the pasted package.json into the Frontend package.json box.
    if (result.packages.length) setPkgFrontendSeed(result.raw);
  }

  // Existing tag / technology-feature / stack values, used to suggest as the
  // user types.
  const [tagOptions, setTagOptions] = useState<Suggestion[]>([]);
  const [featureOptions, setFeatureOptions] = useState<Suggestion[]>([]);
  const [stackOptions, setStackOptions] = useState<Suggestion[]>([]);
  useEffect(() => {
    fetch("/api/admin/projects/meta")
      .then((r) => (r.ok ? r.json() : { tags: [], features: [], stacks: [] }))
      .then(
        (data: {
          tags: Suggestion[];
          features: Suggestion[];
          stacks?: Suggestion[];
        }) => {
          setTagOptions(data.tags ?? []);
          setFeatureOptions(data.features ?? []);
          setStackOptions(data.stacks ?? []);
        },
      )
      .catch(() => {});
  }, []);

  // `stack` is stored as one comma-separated string; expose it to the multi-
  // select as a list and join it back on change. addStack appends a value
  // (used when picking a tech-stack logo).
  const stackList = form.stack
    ? form.stack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const setStackList = (list: string[]) =>
    setForm((f) => ({ ...f, stack: list.join(", ") }));
  const addStack = (name: string) => {
    if (!name || stackList.includes(name)) return;
    setStackList([...stackList, name]);
  };

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
        <AdminFocusScope className="bg-dark-400 rounded-lg border border-dark-600 p-4 sm:p-6 space-y-3">
          <AdminInput
            label="Title"
            required
            value={form.title}
            onChange={(v) => setForm({ ...form, title: v })}
          />

          {/* Optional AI shortcut: paste a package.json to auto-fill the Filter
              Category, Tags, Technology Features and Packages below. The manual
              inputs stay fully editable — this is just a head start. */}
          <PackageAiAnalyzer onResult={applyAnalysis} />

          <AdminInput
            label="Filter Category"
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
            onSelectName={(name) => addStack(name)}
          />
          {/* Stack tech: multi-select over every stack value used across
              projects, with add-new — same UX as Technology Features. Stored as
              a comma-separated string (no schema change). */}
          <CategoryMultiField
            label="Stack Tech"
            value={stackList}
            options={stackOptions}
            onChange={setStackList}
            placeholder="Select stack tech"
            searchPlaceholder="Search stack tech..."
            emptyText="No stack tech found"
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

          {/* Environment — paste a whole .env into any field and it splits into
              individual variable names (values are never stored). Most apps only
              need the general field; Frontend/Backend are for projects with
              separate apps. Empty fields are hidden on the public page. */}
          <div className="flex flex-col gap-4 rounded-lg border border-dark-600 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white">Environment</p>
              <PreviewButton
                onClick={() => setPreview("env")}
                disabled={isEnvEmpty(form.env)}
              />
            </div>
            <p className="text-xs text-light-400">
              Paste your .env into any field below — it splits into individual
              variable names (values are never saved).
            </p>

            <EnvVarsField
              label="Environment Variables"
              value={form.env.general ?? []}
              onChange={(v) =>
                setForm({ ...form, env: { ...form.env, general: v } })
              }
            />
            <EnvVarsField
              label="Frontend (optional)"
              value={form.env.frontend ?? []}
              onChange={(v) =>
                setForm({ ...form, env: { ...form.env, frontend: v } })
              }
            />
            <EnvVarsField
              label="Backend (optional)"
              value={form.env.backend ?? []}
              onChange={(v) =>
                setForm({ ...form, env: { ...form.env, backend: v } })
              }
            />
          </div>

          {/* Packages — paste a package.json (or a bare dependencies object).
              Parsed dependencies render as a formatted code block in the public
              Technology section. */}
          <div className="flex flex-col gap-4 rounded-lg border border-dark-600 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white">
                Packages (package.json)
              </p>
              <PreviewButton
                onClick={() => setPreview("packages")}
                disabled={isPackagesEmpty(form.packages)}
              />
            </div>
            <p className="text-xs text-light-400">
              Paste a package.json (or just its dependencies). The parsed
              dependencies show in the project&apos;s Technology section.
            </p>

            <PasteDropzone
              label="Frontend package.json"
              placeholder={'{ "dependencies": { "react": "^18.2.0" } }'}
              value={pkgFrontendSeed}
              onText={(t) => applyPackages("frontend", t)}
              status={
                pkgError.frontend
                  ? "Invalid JSON — check the pasted content"
                  : `${(form.packages.frontend ?? []).filter(Boolean).length} dependency(ies)`
              }
              error={pkgError.frontend}
            />
            <PasteDropzone
              label="Backend package.json"
              placeholder={'{ "dependencies": { "express": "^4.19.0" } }'}
              onText={(t) => applyPackages("backend", t)}
              status={
                pkgError.backend
                  ? "Invalid JSON — check the pasted content"
                  : `${(form.packages.backend ?? []).filter(Boolean).length} dependency(ies)`
              }
              error={pkgError.backend}
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
            <AdminInput
              label="Source Code"
              placeholder="Single mono-repo or combined codebase URL"
              value={form.downloadLinks.source ?? ""}
              onChange={(v) =>
                setForm({
                  ...form,
                  downloadLinks: { ...form.downloadLinks, source: v },
                })
              }
            />
          </div>

          {/* App downloads — the Apple App Store link. When set, the public
              project page renders a black "Download on the App Store" CTA. */}
          <div className="flex flex-col gap-4 rounded-lg border border-dark-600 p-4">
            <p className="text-sm font-medium text-white">App Downloads</p>
            <AdminInput
              label="Apple App Store Link"
              value={form.downloadLinks.ios ?? ""}
              placeholder="https://apps.apple.com/app/..."
              onChange={(v) =>
                setForm({
                  ...form,
                  downloadLinks: { ...form.downloadLinks, ios: v },
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
        </AdminFocusScope>
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

      {/* Config previews — exactly how the .env / packages render publicly.
          Centered modal on desktop, full-screen sheet on mobile. */}
      <PreviewSheet
        open={preview === "env"}
        title="Environment preview"
        onClose={() => setPreview(null)}
      >
        {(form.env.general ?? []).filter(Boolean).length > 0 && (
          <CodeEditor
            data={(form.env.general ?? []).filter(Boolean)}
            fileType=".env"
          />
        )}
        {(form.env.frontend ?? []).filter(Boolean).length > 0 && (
          <>
            <p className="mt-4 text-sm font-medium text-white">Frontend</p>
            <CodeEditor
              data={(form.env.frontend ?? []).filter(Boolean)}
              fileType=".env"
            />
          </>
        )}
        {(form.env.backend ?? []).filter(Boolean).length > 0 && (
          <>
            <p className="mt-4 text-sm font-medium text-white">Backend</p>
            <CodeEditor
              data={(form.env.backend ?? []).filter(Boolean)}
              fileType=".env"
            />
          </>
        )}
      </PreviewSheet>

      <PreviewSheet
        open={preview === "packages"}
        title="Packages preview"
        onClose={() => setPreview(null)}
      >
        {(form.packages.frontend ?? []).filter(Boolean).length > 0 && (
          <PackagesCodeBlock
            title="Frontend"
            lines={(form.packages.frontend ?? []).filter(Boolean)}
          />
        )}
        {(form.packages.backend ?? []).filter(Boolean).length > 0 && (
          <PackagesCodeBlock
            title="Backend"
            lines={(form.packages.backend ?? []).filter(Boolean)}
          />
        )}
      </PreviewSheet>
    </AdminLayout>
  );
}

// Small "Preview" pill used by the Environment and Packages sections; disabled
// until there's something to preview.
function PreviewButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg border border-dark-600 px-3 py-1.5 text-xs text-white transition-colors hover:border-secondary/60 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Preview
    </button>
  );
}


