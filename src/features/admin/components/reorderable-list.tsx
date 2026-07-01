"use client";

import { motion, useDragControls, type PanInfo } from "framer-motion";
import { RiDraggable } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { useRef, useState, type ReactNode } from "react";

interface ReorderableListProps<T> {
  /** Ordered items. */
  items: T[];
  /** Stable unique id for an item (used as React key + drop calc). */
  getId: (item: T) => string;
  /** Called with the new order after a drop reorders the list. */
  onReorder: (items: T[]) => void;
  /** Render the item's content (the card body). The drag handle is added for you. */
  renderItem: (item: T) => ReactNode;
  /** Called once after a drop that changed the order — persist here. */
  onDragEnd?: () => void;
  className?: string;
  /** Override the default card styling on each row. */
  itemClassName?: string;
}

// Shared card frame so the real card and the ghost placeholder match exactly
// (same padding, border, radius, size → nothing jumps or reflows).
const CARD_FRAME =
  "flex items-start gap-3 rounded-lg border border-dark-600 bg-dark-400 p-4";

/**
 * Generic drag-to-reorder list for admin pages, with a Jira-style ghost.
 *
 * While a card is dragged it floats above (tilt + lift), and its original slot
 * shows a dimmed ghost of the same card so the list never collapses or shifts.
 * The list only reorders on drop. Fully Framer Motion — no HTML5 drag API.
 * Reusable: pass items, getId, renderItem, onReorder, and persist in onDragEnd.
 */
export function ReorderableList<T>({
  items,
  getId,
  onReorder,
  renderItem,
  onDragEnd,
  className,
  itemClassName,
}: ReorderableListProps<T>) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const rowRefs = useRef(new Map<string, HTMLLIElement>());

  function handleDrop(id: string, pointerY: number) {
    setDraggingId(null);

    const ids = items.map(getId);
    const fromIndex = ids.indexOf(id);
    if (fromIndex === -1) return;

    // Insertion point: the first row whose vertical center is below the pointer.
    let insertBefore = items.length;
    for (let i = 0; i < ids.length; i++) {
      const el = rowRefs.current.get(ids[i]);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (pointerY < rect.top + rect.height / 2) {
        insertBefore = i;
        break;
      }
    }

    const next = [...items];
    const [moved] = next.splice(fromIndex, 1);
    const insertIndex = insertBefore > fromIndex ? insertBefore - 1 : insertBefore;
    next.splice(insertIndex, 0, moved);

    const changed = next.some((it, i) => getId(it) !== ids[i]);
    if (changed) {
      onReorder(next);
      onDragEnd?.();
    }
  }

  return (
    <ul className={cn("m-0 list-none space-y-3 p-0", className)}>
      {items.map((item) => {
        const id = getId(item);
        return (
          <ReorderableRow
            key={id}
            content={renderItem(item)}
            isDragging={draggingId === id}
            itemClassName={itemClassName}
            registerRef={(el) => {
              if (el) rowRefs.current.set(id, el);
              else rowRefs.current.delete(id);
            }}
            onDragStart={() => setDraggingId(id)}
            onDrop={(pointerY) => handleDrop(id, pointerY)}
          />
        );
      })}
    </ul>
  );
}

interface RowProps {
  content: ReactNode;
  isDragging: boolean;
  itemClassName?: string;
  registerRef: (el: HTMLLIElement | null) => void;
  onDragStart: () => void;
  onDrop: (pointerY: number) => void;
}

function ReorderableRow({
  content,
  isDragging,
  itemClassName,
  registerRef,
  onDragStart,
  onDrop,
}: RowProps) {
  const controls = useDragControls();

  return (
    <li ref={registerRef} className="relative list-none">
      {/* Ghost placeholder — dimmed copy in the original slot. Absolutely
          positioned to fill the slot (the real card below reserves the height
          via its in-flow transform), so the list never collapses. */}
      {isDragging && (
        <div
          aria-hidden
          className={cn(
            CARD_FRAME,
            "pointer-events-none absolute inset-0 !bg-dark-600 opacity-40",
            itemClassName,
          )}
        >
          <span className="-ml-1 mt-0.5 shrink-0 text-light-400">
            <RiDraggable className="size-5" />
          </span>
          <div className="min-w-0 flex-1">{content}</div>
        </div>
      )}

      {/* The real card. A dragged transform keeps it in the flow (so the slot
          height is reserved) while it visually floats above the ghost. */}
      <motion.div
        drag="y"
        dragListener={false}
        dragControls={controls}
        dragSnapToOrigin
        layout
        onDragStart={onDragStart}
        onDragEnd={(_, info: PanInfo) => onDrop(info.point.y)}
        animate={
          isDragging
            ? {
                rotate: 3,
                scale: 1.02,
                boxShadow: "0px 16px 40px rgba(0,0,0,0.5)",
              }
            : {
                rotate: 0,
                scale: 1,
                boxShadow: "0px 0px 0px rgba(0,0,0,0)",
              }
        }
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          CARD_FRAME,
          isDragging && "relative z-50 cursor-grabbing",
          itemClassName,
        )}
      >
        <button
          type="button"
          aria-label="Drag to reorder"
          onPointerDown={(e) => controls.start(e)}
          className={cn(
            "-ml-1 mt-0.5 shrink-0 touch-none text-light-400 transition-colors hover:text-white",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
        >
          <RiDraggable className="size-5" />
        </button>
        <div className="min-w-0 flex-1">{content}</div>
      </motion.div>
    </li>
  );
}
