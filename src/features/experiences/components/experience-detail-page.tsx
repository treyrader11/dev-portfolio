import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion, Reorder, useDragControls } from "framer-motion";
import { RiDraggable, RiCloseLine, RiAddLine } from "react-icons/ri";
import AdminLayout from "@/features/admin/components/admin-layout";
import { IconUploadField } from "@/features/admin/components/icon-upload-field";
import { ColorSwatchPicker } from "@/features/admin/components/color-swatch-picker";
import { MonthYearRangePicker } from "@/features/admin/components/month-year-range-picker";
import { cn } from "@/lib/utils";
import { type ExperienceItem, emptyExperience } from "../types";

interface Props {
  // null => creating a new experience
  experience: ExperienceItem | null;
}

interface Task {
  id: string;
  value: string;
}

export function ExperienceDetailPage({ experience }: Props) {
  const router = useRouter();
  const isNew = !experience;
  const idCounter = useRef(0);

  const [form, setForm] = useState(() =>
    experience
      ? {
          title: experience.title,
          company: experience.company,
          iconUrl: experience.iconUrl,
          iconBg: experience.iconBg,
          date: experience.date,
          websiteUrl: experience.websiteUrl,
          sortOrder: experience.sortOrder,
        }
      : {
          title: emptyExperience.title,
          company: emptyExperience.company,
          iconUrl: emptyExperience.iconUrl,
          iconBg: emptyExperience.iconBg,
          date: emptyExperience.date,
          websiteUrl: emptyExperience.websiteUrl,
          sortOrder: emptyExperience.sortOrder,
        },
  );

  // Tasks carry a stable id so drag-reorder is keyed correctly even while their
  // text is edited. They serialize back to a plain string[] on save.
  const [tasks, setTasks] = useState<Task[]>(() => {
    const pts = experience?.points?.length ? experience.points : [""];
    return pts.map((value) => ({ id: `t${idCounter.current++}`, value }));
  });

  const [saving, setSaving] = useState(false);
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);

  // Dirty-tracking: any field or task edit reveals the fixed save bar. The
  // initial snapshot is captured once, on the first render.
  const snapshot = JSON.stringify({ ...form, points: tasks.map((t) => t.value) });
  const initialSnapshot = useRef<string | undefined>(undefined);
  if (initialSnapshot.current === undefined) initialSnapshot.current = snapshot;
  const dirty = snapshot !== initialSnapshot.current;

  function addTask() {
    setTasks((t) => [...t, { id: `t${idCounter.current++}`, value: "" }]);
  }
  function updateTask(id: string, value: string) {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, value } : x)));
  }
  function removeTask(id: string) {
    setTasks((t) => t.filter((x) => x.id !== id));
  }

  async function handleSave() {
    setSaving(true);
    const points = tasks.map((t) => t.value.trim()).filter(Boolean);
    const res = await fetch(
      isNew
        ? "/api/admin/experiences"
        : `/api/admin/experiences/${experience.id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, points }),
      },
    );
    setSaving(false);
    if (res.ok) router.push("/admin/experience");
  }

  const title = isNew
    ? "New Experience"
    : experience.company || experience.title || "Experience";

  return (
    <AdminLayout
      title={title}
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Experience", href: "/admin/experience" },
        { label: isNew ? "New" : experience.company },
      ]}
    >
      <div className="w-full max-w-3xl pb-24">
        <div className="bg-dark-400 rounded-lg border border-dark-600 p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Title/Role"
              value={form.title}
              onChange={(v) => setForm({ ...form, title: v })}
            />
            <Input
              label="Company"
              value={form.company}
              onChange={(v) => setForm({ ...form, company: v })}
            />
          </div>

          <MonthYearRangePicker
            label="Date Range"
            value={form.date}
            onChange={(v) => setForm({ ...form, date: v })}
          />

          <Input
            label="Website URL"
            value={form.websiteUrl}
            onChange={(v) => setForm({ ...form, websiteUrl: v })}
          />

          <IconUploadField
            label="Icon"
            value={form.iconUrl}
            previewBg={form.iconBg}
            onChange={(v) => setForm({ ...form, iconUrl: v })}
          />

          <ColorSwatchPicker
            label="Icon Background"
            value={form.iconBg}
            onChange={(v) => setForm({ ...form, iconBg: v })}
          />

          {/* Tasks — drag the handle to reorder. Focusing a task lifts only
              that row above the blurred backdrop; everything else (page and the
              other tasks) blurs behind it. */}
          <div className="relative">
            <AnimatePresence>
              {focusedTaskId && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                />
              )}
            </AnimatePresence>

            <label className="block text-sm font-medium text-white mb-2">
              Tasks
            </label>
            <Reorder.Group
              axis="y"
              values={tasks}
              onReorder={setTasks}
              className="space-y-2"
            >
              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  focused={focusedTaskId === task.id}
                  onFocus={() => setFocusedTaskId(task.id)}
                  onBlur={() =>
                    setFocusedTaskId((cur) => (cur === task.id ? null : cur))
                  }
                  onChange={updateTask}
                  onRemove={removeTask}
                />
              ))}
            </Reorder.Group>
            <button
              type="button"
              onClick={addTask}
              className="mt-2 inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
            >
              <RiAddLine className="size-4" /> Add task
            </button>
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
              onClick={() => router.push("/admin/experience")}
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

function TaskRow({
  task,
  focused,
  onFocus,
  onBlur,
  onChange,
  onRemove,
}: {
  task: Task;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onChange: (id: string, value: string) => void;
  onRemove: (id: string) => void;
}) {
  const controls = useDragControls();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // While focused the textarea grows to fit its wrapped text; unfocused it
  // collapses back to a single clipped line.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    if (focused) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    } else {
      el.style.height = "";
    }
  }, [focused, task.value]);

  return (
    <Reorder.Item
      value={task}
      dragListener={false}
      dragControls={controls}
      // Only the focused row rises above the blurred backdrop (z-40).
      className={cn("relative", focused && "z-50")}
    >
      {/* No static border — on focus the row animates into a raised card. */}
      <motion.div
        animate={{ scale: focused ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className={cn(
          "flex gap-2 rounded-lg p-2 transition-colors",
          focused
            ? "items-start bg-dark-600 shadow-2xl ring-1 ring-secondary/50"
            : "items-center bg-transparent hover:bg-dark-500",
        )}
      >
        <button
          type="button"
          aria-label="Drag to reorder"
          onPointerDown={(e) => controls.start(e)}
          className={cn(
            "cursor-grab touch-none text-light-400 hover:text-white active:cursor-grabbing",
            focused && "mt-1",
          )}
        >
          <RiDraggable className="size-5" />
        </button>
        <textarea
          ref={textareaRef}
          rows={1}
          value={task.value}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(e) => onChange(task.id, e.target.value)}
          placeholder="Describe a task or achievement"
          className={cn(
            "flex-1 resize-none bg-transparent px-1 py-1 text-sm text-white outline-none placeholder:text-light-400",
            focused
              ? "whitespace-pre-wrap break-words"
              : "h-7 overflow-hidden whitespace-nowrap",
          )}
        />
        <button
          type="button"
          aria-label="Remove task"
          onClick={() => onRemove(task.id)}
          className={cn("text-error hover:text-error-600", focused && "mt-1")}
        >
          <RiCloseLine className="size-5" />
        </button>
      </motion.div>
    </Reorder.Item>
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
