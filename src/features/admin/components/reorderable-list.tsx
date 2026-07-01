"use client";

import { Reorder, useDragControls } from "framer-motion";
import { RiDraggable } from "react-icons/ri";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ReorderableListProps<T> {
  /** Ordered items. Reordering replaces this array (same object references). */
  items: T[];
  /** Stable unique id for an item (used as React key). */
  getId: (item: T) => string;
  /** Called continuously during a drag with the new order — wire to setState. */
  onReorder: (items: T[]) => void;
  /** Render the item's content (the card body). The drag handle is added for you. */
  renderItem: (item: T) => ReactNode;
  /** Called once when a drag finishes — persist the order here. */
  onDragEnd?: () => void;
  className?: string;
  /** Override the default card styling on each row. */
  itemClassName?: string;
}

/**
 * Generic drag-to-reorder list for admin pages. Dragging is restricted to the
 * grip handle (dragListener is off on the row, the handle starts the drag), so
 * buttons/links inside a row stay clickable. Reusable for any list with a
 * stable id — pass items, getId, renderItem, and persist in onDragEnd.
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
  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={onReorder}
      className={cn("space-y-3 list-none p-0 m-0", className)}
    >
      {items.map((item) => (
        <ReorderableRow
          key={getId(item)}
          item={item}
          onDragEnd={onDragEnd}
          itemClassName={itemClassName}
        >
          {renderItem(item)}
        </ReorderableRow>
      ))}
    </Reorder.Group>
  );
}

interface RowProps<T> {
  item: T;
  children: ReactNode;
  onDragEnd?: () => void;
  itemClassName?: string;
}

function ReorderableRow<T>({
  item,
  children,
  onDragEnd,
  itemClassName,
}: RowProps<T>) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      className={cn(
        "flex items-start gap-3 rounded-lg border border-dark-600 bg-dark-400 p-4",
        itemClassName,
      )}
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        onPointerDown={(e) => controls.start(e)}
        className={cn(
          "shrink-0 -ml-1 mt-0.5 cursor-grab touch-none text-light-400",
          "transition-colors hover:text-white active:cursor-grabbing",
        )}
      >
        <RiDraggable className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
    </Reorder.Item>
  );
}
