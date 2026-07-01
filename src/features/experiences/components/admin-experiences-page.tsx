import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { RiDeleteBinLine } from "react-icons/ri";
import AdminLayout from "@/features/admin/components/admin-layout";
import { ReorderableList } from "@/features/admin/components/reorderable-list";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import { slugify } from "@/lib/utils";
import { type ExperienceItem } from "../types";

interface Props {
  experiences: ExperienceItem[];
}

export function AdminExperiencesPage({ experiences: initial }: Props) {
  const [items, setItems] = useState(initial);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const router = useRouter();
  const { addNotification } = useNotificationsContext();

  // Keep the latest order in a ref so the drag-end handler persists it.
  const orderRef = useRef(items);
  orderRef.current = items;

  async function saveOrder() {
    try {
      const res = await fetch("/api/admin/experiences/reorder", {
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

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/experiences/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setConfirmId(null);
      addNotification({ text: "Experience deleted", variant: "success" });
    } else {
      addNotification({ text: "Couldn't delete", variant: "error" });
    }
  }

  return (
    <AdminLayout title="Experience">
      <div className="max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-light-400">
            {items.length} experience{items.length === 1 ? "" : "s"}
          </p>
          <Link
            href="/admin/experience/new"
            className="px-4 py-2 bg-secondary text-white text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Add Experience
          </Link>
        </div>

        <p className="mb-4 text-xs text-light-400">
          Click a card to edit it, or press and hold to drag and reorder.
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
            router.push(`/admin/experience/${slugify(item.company)}`)
          }
          renderItem={(item) => (
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-medium text-secondary truncate">
                  {item.title}
                </h3>
                <p className="text-sm text-light-400">
                  {item.company} &middot; {item.date}
                </p>
                <p className="text-xs text-light-400 mt-1">
                  {item.points.length} points
                </p>
              </div>

              {/* Delete with inline confirm. data-no-drag + stopPropagation so
                  it never starts a drag or triggers the card's click nav. */}
              <div
                data-no-drag
                className="flex shrink-0 items-center gap-2"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {confirmId === item.id ? (
                  <>
                    <span className="text-xs text-light-400">Delete?</span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs font-medium text-red-400 hover:text-red-300"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="text-xs text-light-400 hover:text-white"
                    >
                      No
                    </button>
                  </>
                ) : (
                  <button
                    aria-label="Delete experience"
                    onClick={() => setConfirmId(item.id)}
                    className="text-red-400 transition-colors hover:text-red-300"
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
