import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  RiDeleteBinLine,
  RiStarLine,
  RiStarFill,
  RiImageLine,
  RiImageFill,
  RiCloseLine,
  RiGithubFill,
  RiArrowRightLine,
} from "react-icons/ri";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import AdminLayout from "@/features/admin/components/admin-layout";
import { ReorderableList } from "@/features/admin/components/reorderable-list";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import { cn, slugify } from "@/lib/utils";
import { type ProjectItem } from "../types";

interface Props {
  projects: ProjectItem[];
}

const HEADSHOT = "/images/portraits/headshot.png";

// The list icon: prefer the project's own icon, then its product shot, then the
// site's profile headshot so there's always something recognizable.
function projectIcon(item: ProjectItem): string {
  const image = item.image as { icon?: string; src?: string } | null;
  return image?.icon || image?.src || item.projectImage || HEADSHOT;
}

export function AdminProjectsPage({ projects: initial }: Props) {
  const [items, setItems] = useState(initial);
  // The home page sliding-images strip: the projects flagged isSlider, in their
  // sliderOrder. Reordered/removed here; added via a project's own toggle or the
  // per-row control below.
  const [sliderItems, setSliderItems] = useState<ProjectItem[]>(() =>
    initial
      .filter((p) => p.isSlider)
      .sort((a, b) => a.sliderOrder - b.sliderOrder),
  );
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const router = useRouter();
  const { addNotification } = useNotificationsContext();

  // Keep the latest order in a ref so the drag-end handler persists it.
  const orderRef = useRef(items);
  orderRef.current = items;
  const sliderOrderRef = useRef(sliderItems);
  sliderOrderRef.current = sliderItems;

  async function saveOrder() {
    try {
      const res = await fetch("/api/admin/projects/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: orderRef.current.map((i) => i.id) }),
      });
      if (!res.ok) throw new Error("Request failed");
      addNotification({ text: "Order saved", variant: "success" });
    } catch {
      addNotification({ text: "Couldn't save order", variant: "error" });
    }
  }

  async function saveSliderOrder() {
    try {
      const res = await fetch("/api/admin/projects/slider-reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: sliderOrderRef.current.map((i) => i.id) }),
      });
      if (!res.ok) throw new Error("Request failed");
      addNotification({ text: "Slider order saved", variant: "success" });
    } catch {
      addNotification({ text: "Couldn't save slider order", variant: "error" });
    }
  }

  // Toggle whether a project's poster appears in the home sliding-images strip.
  async function toggleSlider(item: ProjectItem) {
    const next = !item.isSlider;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isSlider: next } : i)),
    );
    setSliderItems((prev) =>
      next
        ? prev.some((i) => i.id === item.id)
          ? prev
          : [...prev, { ...item, isSlider: true }]
        : prev.filter((i) => i.id !== item.id),
    );
    const res = await fetch(`/api/admin/projects/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isSlider: next }),
    });
    if (!res.ok) {
      // Revert on failure.
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isSlider: !next } : i)),
      );
      setSliderItems((prev) =>
        !next
          ? prev.some((i) => i.id === item.id)
            ? prev
            : [...prev, { ...item, isSlider: true }]
          : prev.filter((i) => i.id !== item.id),
      );
      addNotification({ text: "Couldn't update", variant: "error" });
    } else {
      addNotification({
        text: next ? "Added to sliding images" : "Removed from sliding images",
        variant: "success",
      });
      // Persist the new slider order after an add so the appended item sticks.
      if (next) saveSliderOrder();
    }
  }

  // Toggle whether a project appears in the public "Latest Work" section. That
  // section renders recent projects in this list's order.
  async function toggleRecent(item: ProjectItem) {
    const next = !item.isRecent;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isRecent: next } : i)),
    );
    const res = await fetch(`/api/admin/projects/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRecent: next }),
    });
    if (!res.ok) {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isRecent: !next } : i)),
      );
      addNotification({ text: "Couldn't update", variant: "error" });
    } else {
      addNotification({
        text: next ? "Added to Latest Work" : "Removed from Latest Work",
        variant: "success",
      });
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setConfirmId(null);
      addNotification({ text: "Project deleted", variant: "success" });
    } else {
      addNotification({ text: "Couldn't delete", variant: "error" });
    }
  }

  return (
    <AdminLayout title="Projects">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-light-400">
            {items.length} project{items.length === 1 ? "" : "s"}
          </p>
          <Link
            href="/admin/projects/new"
            className="px-4 py-2 bg-secondary text-white text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Add Project
          </Link>
        </div>

        <p className="mb-4 text-xs text-light-400">
          Click a card to edit it, or press and hold to drag and reorder. The
          star adds a project to the home page &ldquo;Latest Work&rdquo;
          section, shown in this order; the image icon adds its poster to the
          home &ldquo;Sliding Images&rdquo; strip.
        </p>

        {/* GitHub repositories management */}
        <Link
          href="/admin/repos"
          className="mb-8 flex items-center justify-between gap-3 rounded-lg border border-dark-600 bg-dark-400 p-4 transition-colors hover:border-secondary/60"
        >
          <div className="flex items-center gap-3">
            <RiGithubFill className="size-6 text-white" />
            <div>
              <p className="text-sm font-medium text-white">
                GitHub Repositories
              </p>
              <p className="text-xs text-light-400">
                Reorder, exclude, and set how many fetched repos show on the
                portfolio.
              </p>
            </div>
          </div>
          <RiArrowRightLine className="size-5 text-light-400" />
        </Link>

        {sliderItems.length > 0 && (
          <div className="mb-8 rounded-lg border border-dark-600 bg-dark-400/40 p-4">
            <h2 className="text-sm font-medium text-white">Sliding Images</h2>
            <p className="mb-3 mt-1 text-xs text-light-400">
              Project posters shown in the home page sliding strip. Press and
              hold to drag and reorder; the &times; removes a poster.
            </p>
            <ReorderableList
              items={sliderItems}
              getId={(item) => item.id}
              onReorder={(next) => {
                sliderOrderRef.current = next;
                setSliderItems(next);
              }}
              onDragEnd={saveSliderOrder}
              renderItem={(item) => (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {/* The poster is what actually shows in the strip. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.projectImage || projectIcon(item)}
                      alt=""
                      className="h-10 w-16 shrink-0 rounded-md border border-dark-600 bg-dark-600 object-cover"
                    />
                    <h3 className="min-w-0 truncate font-medium text-secondary">
                      {item.title}
                    </h3>
                  </div>
                  <button
                    data-no-drag
                    aria-label="Remove from sliding images"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSlider(item);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="shrink-0 text-light-400 transition-colors hover:text-error"
                  >
                    <RiCloseLine className="size-5" />
                  </button>
                </div>
              )}
            />
          </div>
        )}

        <ReorderableList
          items={items}
          getId={(item) => item.id}
          onReorder={(next) => {
            orderRef.current = next;
            setItems(next);
          }}
          onDragEnd={saveOrder}
          onItemClick={(item) =>
            router.push(`/admin/projects/${slugify(item.title)}`)
          }
          itemClassName="group"
          renderItem={(item) => (
            <div className="flex items-start justify-between gap-3">
              {/* Reveal an edit affordance in the card's bottom-right on hover. */}
              <HiOutlinePencilSquare className="pointer-events-none absolute bottom-3 right-3 size-4 text-light-400 opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="flex min-w-0 items-start gap-3">
                {/* Project/app icon, falling back to the product shot, then to
                    the site's profile headshot when neither exists. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={projectIcon(item)}
                  alt=""
                  className="size-9 shrink-0 rounded-md border border-dark-600 bg-dark-600 object-cover"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-secondary truncate">
                      {item.title}
                    </h3>
                    {item.isPriority && (
                      <span className="text-xs bg-yellow-900/40 text-yellow-400 px-2 py-0.5 rounded">
                        Priority
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-light-400 mt-1">
                    {item.category} &middot; {item.stack}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-dark-600 text-light-400 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Controls: Latest Work toggle + delete. data-no-drag +
                  stopPropagation so they never start a drag or open the editor. */}
              <div
                data-no-drag
                className="flex shrink-0 flex-col items-end gap-2"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <button
                  aria-pressed={item.isRecent}
                  onClick={() => toggleRecent(item)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                    item.isRecent
                      ? "bg-success/15 text-success hover:bg-success/25"
                      : "text-light-400 hover:bg-dark-600 hover:text-white",
                  )}
                >
                  {item.isRecent ? (
                    <RiStarFill className="size-3.5" />
                  ) : (
                    <RiStarLine className="size-3.5" />
                  )}
                  {item.isRecent ? "In Latest Work" : "Add to Latest Work"}
                </button>

                <button
                  aria-pressed={item.isSlider}
                  onClick={() => toggleSlider(item)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                    item.isSlider
                      ? "bg-success/15 text-success hover:bg-success/25"
                      : "text-light-400 hover:bg-dark-600 hover:text-white",
                  )}
                >
                  {item.isSlider ? (
                    <RiImageFill className="size-3.5" />
                  ) : (
                    <RiImageLine className="size-3.5" />
                  )}
                  {item.isSlider ? "In Sliding Images" : "Add to Sliding Images"}
                </button>

                {confirmId === item.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-light-400">Delete?</span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs font-medium text-error hover:text-error-600"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="text-xs text-light-400 hover:text-white"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    aria-label="Delete project"
                    onClick={() => setConfirmId(item.id)}
                    className="text-error transition-colors hover:text-error-600"
                  >
                    <RiDeleteBinLine className="size-5" />
                  </button>
                )}
              </div>
            </div>
          )}
        />
      </div>
    </AdminLayout>
  );
}
