import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiDeleteBinLine,
  RiCloseLine,
  RiArrowUpSLine,
  RiLoader4Line,
} from "react-icons/ri";
import { FqdAddIcon } from "@/components/icons/FqdAddIcon";
import { FqdRemoveIcon } from "@/components/icons/FqdRemoveIcon";
import { cn } from "@/lib/utils";

interface Props {
  count: number;
  busy?: boolean;
  onAdd: () => void;
  onRemove: () => void;
  onDelete: () => void;
  onClear: () => void;
}

// A floating, collapsible bulk-actions bar that overlaps the list (high z-index)
// whenever one or more events are selected. Lists the FQD add / remove and
// delete actions for the whole selection.
export function EventBulkActionsBar({
  count,
  busy,
  onAdd,
  onRemove,
  onDelete,
  onClear,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 30 }}
          className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
        >
          <div className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-dark-600 bg-dark-500/95 p-1.5 shadow-2xl backdrop-blur">
            {/* Count + collapse toggle */}
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              title={collapsed ? "Show bulk actions" : "Hide bulk actions"}
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium text-white hover:bg-dark-600"
            >
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
                {busy ? (
                  <RiLoader4Line className="size-3.5 animate-spin" />
                ) : (
                  count
                )}
              </span>
              <span className="hidden sm:inline">selected</span>
              <RiArrowUpSLine
                className={cn(
                  "size-4 text-light-400 transition-transform",
                  collapsed && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-1 overflow-hidden"
                >
                  <span className="mx-0.5 h-6 w-px shrink-0 bg-dark-600" />
                  <Action
                    onClick={onAdd}
                    disabled={busy}
                    label="Add to FQD"
                    title="Mark selected as added to French Quarter Direct"
                    className="text-lime-400 hover:bg-lime-400/10"
                  >
                    <FqdAddIcon size={20} />
                  </Action>
                  <Action
                    onClick={onRemove}
                    disabled={busy}
                    label="Remove"
                    title="Mark selected as not added to French Quarter Direct"
                    className="text-light-400 hover:bg-dark-600 hover:text-white"
                  >
                    <FqdRemoveIcon size={20} />
                  </Action>
                  <Action
                    onClick={onDelete}
                    disabled={busy}
                    label="Delete"
                    title="Delete selected events"
                    className="text-error hover:bg-error/10"
                  >
                    <RiDeleteBinLine className="size-5" />
                  </Action>
                  <span className="mx-0.5 h-6 w-px shrink-0 bg-dark-600" />
                  <button
                    type="button"
                    onClick={onClear}
                    title="Clear selection"
                    aria-label="Clear selection"
                    className="rounded-lg p-2 text-light-400 transition-colors hover:bg-dark-600 hover:text-white"
                  >
                    <RiCloseLine className="size-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Action({
  children,
  label,
  title,
  onClick,
  disabled,
  className,
}: {
  children: ReactNode;
  label: string;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-sm font-medium transition-colors disabled:opacity-50",
        className,
      )}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
