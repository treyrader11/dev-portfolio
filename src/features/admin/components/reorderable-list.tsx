"use client";

import { motion, useDragControls, type PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

interface ReorderableListProps<T> {
  /** Ordered items. */
  items: T[];
  /** Stable unique id for an item (used as React key + drop calc). */
  getId: (item: T) => string;
  /** Called with the new order after a drop reorders the list. */
  onReorder: (items: T[]) => void;
  /** Render the item's content (the card body). */
  renderItem: (item: T) => ReactNode;
  /** Called once after a drop that changed the order — persist here. */
  onDragEnd?: () => void;
  /** Called on a plain click (not a drag) — e.g. navigate to a detail page. */
  onItemClick?: (item: T) => void;
  className?: string;
  /** Override the default card styling on each row. */
  itemClassName?: string;
}

// Shared card frame so the real card and the ghost placeholder match exactly.
const CARD_FRAME = cn(
  "flex",
  "items-start",
  "gap-3",
  "rounded-lg",
  "border",
  "border-dark-600",
  "bg-dark-400",
  "p-4",
);

// Press-and-hold this long (with little movement) to pick a card up. A quick
// click instead fires onItemClick, and a quick drag scrolls the page — so touch
// scrolling still works.
const LONG_PRESS_MS = 220;
const MOVE_CANCEL_PX = 8;

/**
 * Generic drag-to-reorder list for admin pages, with a Jira-style ghost.
 *
 * No drag handle: long-press (click and hold) anywhere on a card to drag it; a
 * plain click fires onItemClick. While dragging, the card floats (tilt + lift)
 * and its original slot shows a dimmed ghost so the list never collapses. The
 * list only reorders on drop. Fully Framer Motion — no HTML5 drag API.
 */
export function ReorderableList<T>({
  items,
  getId,
  onReorder,
  renderItem,
  onDragEnd,
  onItemClick,
  className,
  itemClassName,
}: ReorderableListProps<T>) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const rowRefs = useRef(new Map<string, HTMLLIElement>());
  const remountCounts = useRef(new Map<string, number>());

  function computeInsertIndex(pointerY: number): number {
    const ids = items.map(getId);
    for (let i = 0; i < ids.length; i++) {
      const el = rowRefs.current.get(ids[i]);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (pointerY < rect.top + rect.height / 2) return i;
    }
    return items.length;
  }

  function handleDrop(id: string, pointerY: number) {
    setDraggingId(null);
    setDropIndex(null);

    const ids = items.map(getId);
    const fromIndex = ids.indexOf(id);
    if (fromIndex === -1) return;

    const insertBefore = computeInsertIndex(pointerY);
    const next = [...items];
    const [moved] = next.splice(fromIndex, 1);
    const insertIndex =
      insertBefore > fromIndex ? insertBefore - 1 : insertBefore;
    next.splice(insertIndex, 0, moved);

    remountCounts.current.set(id, (remountCounts.current.get(id) ?? 0) + 1);

    const changed = next.some((it, i) => getId(it) !== ids[i]);
    if (changed) {
      onReorder(next);
      onDragEnd?.();
    }
  }

  return (
    <ul className={cn("m-0", "list-none", "space-y-3", "p-0", className)}>
      {items.map((item, index) => {
        const id = getId(item);
        return (
          <ReorderableRow
            key={`${id}:${remountCounts.current.get(id) ?? 0}`}
            index={index}
            count={items.length}
            dropIndex={draggingId ? dropIndex : null}
            content={renderItem(item)}
            isDragging={draggingId === id}
            clickable={Boolean(onItemClick)}
            itemClassName={itemClassName}
            registerRef={(el) => {
              if (el) rowRefs.current.set(id, el);
              else rowRefs.current.delete(id);
            }}
            onDragStart={() => setDraggingId(id)}
            onDragMove={(pointerY) => setDropIndex(computeInsertIndex(pointerY))}
            onDrop={(pointerY) => handleDrop(id, pointerY)}
            onItemClick={onItemClick ? () => onItemClick(item) : undefined}
          />
        );
      })}
    </ul>
  );
}

const DROP_LINE =
  "pointer-events-none absolute inset-x-0 z-[60] h-0.5 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.7)]";

interface RowProps {
  index: number;
  count: number;
  dropIndex: number | null;
  content: ReactNode;
  isDragging: boolean;
  clickable: boolean;
  itemClassName?: string;
  registerRef: (el: HTMLLIElement | null) => void;
  onDragStart: () => void;
  onDragMove: (pointerY: number) => void;
  onDrop: (pointerY: number) => void;
  onItemClick?: () => void;
}

function ReorderableRow({
  index,
  count,
  dropIndex,
  content,
  isDragging,
  clickable,
  itemClassName,
  registerRef,
  onDragStart,
  onDragMove,
  onDrop,
  onItemClick,
}: RowProps) {
  const controls = useDragControls();
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const draggedRef = useRef(false);

  const showTopLine = dropIndex === index;
  const showBottomLine = dropIndex === count && index === count - 1;

  function clearTimer() {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    // Let interactive children (trash, confirm buttons) handle their own events.
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    draggedRef.current = false;
    startPos.current = { x: e.clientX, y: e.clientY };
    pressTimer.current = setTimeout(() => controls.start(e), LONG_PRESS_MS);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!pressTimer.current || !startPos.current) return;
    const dx = Math.abs(e.clientX - startPos.current.x);
    const dy = Math.abs(e.clientY - startPos.current.y);
    // Moving before the long-press engages means a scroll/tap — cancel the drag.
    if (dx > MOVE_CANCEL_PX || dy > MOVE_CANCEL_PX) clearTimer();
  }

  return (
    <li ref={registerRef} className="relative list-none">
      {showTopLine && (
        <span aria-hidden className={cn(DROP_LINE, "-top-1.5")} />
      )}
      {showBottomLine && (
        <span aria-hidden className={cn(DROP_LINE, "-bottom-1.5")} />
      )}

      {isDragging && (
        <div
          aria-hidden
          className={cn(
            CARD_FRAME,
            "pointer-events-none absolute inset-0 !bg-dark-600 opacity-40",
            itemClassName,
          )}
        >
          <div className="min-w-0 flex-1">{content}</div>
        </div>
      )}

      <motion.div
        drag="y"
        dragListener={false}
        dragControls={controls}
        onDragStart={() => {
          draggedRef.current = true;
          onDragStart();
        }}
        onDrag={(_, info: PanInfo) => onDragMove(info.point.y)}
        onDragEnd={(_, info: PanInfo) => onDrop(info.point.y)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={clearTimer}
        onPointerCancel={clearTimer}
        onClick={(e) => {
          // Suppress the click that follows a drag; otherwise navigate.
          if (draggedRef.current) {
            e.preventDefault();
            return;
          }
          onItemClick?.();
        }}
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
          "select-none cursor-grab touch-pan-y",
          clickable && "hover:border-secondary/60",
          isDragging && "relative z-50 cursor-grabbing",
          itemClassName,
        )}
      >
        <div className="min-w-0 flex-1">{content}</div>
      </motion.div>
    </li>
  );
}
