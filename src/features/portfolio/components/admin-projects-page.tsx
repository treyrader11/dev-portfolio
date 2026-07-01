import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { RiDeleteBinLine, RiStarLine, RiStarFill } from "react-icons/ri";
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
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const router = useRouter();
  const { addNotification } = useNotificationsContext();

  // Keep the latest order in a ref so the drag-end handler persists it.
  const orderRef = useRef(items);
  orderRef.current = items;

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
          section, shown in this order.
        </p>

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
