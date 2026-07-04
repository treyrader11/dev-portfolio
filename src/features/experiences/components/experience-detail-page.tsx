import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { motion, Reorder, useDragControls } from "framer-motion";
import { RiDraggable, RiCloseLine, RiAddLine } from "react-icons/ri";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/features/admin/components/admin-layout";
import { AdminForm } from "@/features/admin/components/admin-form";
import { AdminTextField } from "@/features/admin/components/admin-field";
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import { IconUploadField } from "@/features/admin/components/icon-upload-field";
import { ColorSwatchPicker } from "@/features/admin/components/color-swatch-picker";
import { MonthYearRangePicker } from "@/features/admin/components/month-year-range-picker";
import { useFocusExpandContext } from "@/hooks/use-focus-expand";
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

const experienceSchema = z.object({
  title: z.string().min(1, "Title/Role is required"),
  company: z.string().min(1, "Company is required"),
  iconUrl: z.string(),
  iconBg: z.string(),
  date: z.string(),
  websiteUrl: z.string(),
  sortOrder: z.number(),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

export function ExperienceDetailPage({ experience }: Props) {
  const router = useRouter();
  const isNew = !experience;
  const idCounter = useRef(0);

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: experience
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
  });

  // Tasks carry a stable id so drag-reorder is keyed correctly even while their
  // text is edited. They live outside react-hook-form (drag-reorder + an inline
  // handle/remove don't fit a Controller cleanly) and serialize back to a plain
  // string[] on save.
  const [tasks, setTasks] = useState<Task[]>(() => {
    const pts = experience?.points?.length ? experience.points : [""];
    return pts.map((value) => ({ id: `t${idCounter.current++}`, value }));
  });

  const [saving, setSaving] = useState(false);

  // The task pending deletion drives the confirm modal; null when closed.
  const { addNotification } = useNotificationsContext();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  // Dirty-tracking reveals the fixed save bar. react-hook-form owns the scalar
  // fields; the tasks are compared against their initial serialization.
  const initialPoints = useRef(
    JSON.stringify(experience?.points?.length ? experience.points : [""]),
  );
  const pointsDirty =
    JSON.stringify(tasks.map((t) => t.value)) !== initialPoints.current;
  const dirty = form.formState.isDirty || pointsDirty;

  const iconBg = form.watch("iconBg");

  function addTask() {
    setTasks((t) => [...t, { id: `t${idCounter.current++}`, value: "" }]);
  }
  function updateTask(id: string, value: string) {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, value } : x)));
  }
  function removeTask(id: string) {
    setTasks((t) => t.filter((x) => x.id !== id));
  }
  // Clicking a task's X asks for confirmation first; confirming removes it and
  // shows a toast.
  function confirmRemoveTask() {
    if (pendingDelete) {
      removeTask(pendingDelete);
      addNotification({ text: "Task removed", variant: "success" });
    }
    setPendingDelete(null);
  }

  async function onSubmit(values: ExperienceFormValues) {
    setSaving(true);
    const points = tasks.map((t) => t.value.trim()).filter(Boolean);
    const res = await fetch(
      isNew
        ? "/api/admin/experiences"
        : `/api/admin/experiences/${experience?.id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, points }),
      },
    );
    setSaving(false);
    if (res.ok) router.push("/admin/experience");
  }

  const pageTitle = isNew
    ? "New Experience"
    : experience.company || experience.title || "Experience";

  return (
    <AdminLayout
      title={pageTitle}
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Experience", href: "/admin/experience" },
        { label: isNew ? "New" : experience.company },
      ]}
    >
      <div className="w-full pb-24">
        <div className="rounded-lg border border-dark-600 bg-dark-400 p-6">
          <AdminForm form={form} onSubmit={onSubmit}>
            <AdminTextField
              name="title"
              label="Title/Role"
              required
              placeholder="e.g. Senior Engineer"
            />
            <AdminTextField name="company" label="Company" required />

            <Controller
              name="date"
              control={form.control}
              render={({ field }) => (
                <MonthYearRangePicker
                  label="Date Range"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <AdminTextField
              name="websiteUrl"
              label="Website URL"
              placeholder="https://"
            />

            <Controller
              name="iconUrl"
              control={form.control}
              render={({ field }) => (
                <IconUploadField
                  label="Icon"
                  value={field.value}
                  previewBg={iconBg}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              name="iconBg"
              control={form.control}
              render={({ field }) => (
                <ColorSwatchPicker
                  label="Icon Background"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <TasksSection
              tasks={tasks}
              setTasks={setTasks}
              onAdd={addTask}
              onChange={updateTask}
              onRemove={(id) => setPendingDelete(id)}
            />
          </AdminForm>
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
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <span className="text-sm text-light-400">
            You have unsaved changes
          </span>
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
              onClick={form.handleSubmit(onSubmit)}
              disabled={saving}
              className="rounded-lg bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success-600 disabled:opacity-50"
            >
              {saving ? "Saving..." : isNew ? "Create" : "Save"}
            </button>
          </div>
        </div>
      </motion.div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete task?"
        message="This task will be removed from the list. This can't be undone once you save."
        confirmLabel="Delete"
        onConfirm={confirmRemoveTask}
        onCancel={() => setPendingDelete(null)}
      />
    </AdminLayout>
  );
}

// The tasks list, rendered inside <AdminForm> so it can read the shared
// focus-expand state. When a task is focused the whole list lifts above the
// blur backdrop; the focused row stays sharp while its siblings (and the fields
// above) dim.
function TasksSection({
  tasks,
  setTasks,
  onAdd,
  onChange,
  onRemove,
}: {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  onAdd: () => void;
  onChange: (id: string, value: string) => void;
  onRemove: (id: string) => void;
}) {
  const focus = useFocusExpandContext();
  const anyTaskFocused = tasks.some((t) => focus?.isFocused(t.id));

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-medium text-white">Tasks</label>
      <Reorder.Group
        axis="y"
        values={tasks}
        onReorder={setTasks}
        className={cn("space-y-2", anyTaskFocused && "relative z-50")}
      >
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onChange={onChange}
            onRemove={onRemove}
          />
        ))}
      </Reorder.Group>
      <button
        type="button"
        onClick={onAdd}
        className="mt-2 inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
      >
        <RiAddLine className="size-4" /> Add task
      </button>
    </div>
  );
}

function TaskRow({
  task,
  onChange,
  onRemove,
}: {
  task: Task;
  onChange: (id: string, value: string) => void;
  onRemove: (id: string) => void;
}) {
  const focus = useFocusExpandContext();
  const focused = focus?.isFocused(task.id) ?? false;
  const dimmed = focus?.isDimmed(task.id) ?? false;
  const focusProps = focus?.getFocusProps(task.id);
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
    <Reorder.Item value={task} dragListener={false} dragControls={controls}>
      {/* No static border — on focus the row animates into a raised card. The
          non-focused rows blur themselves; the focused one stays sharp. */}
      <motion.div
        animate={{ scale: focused ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className={cn(
          "flex gap-2 rounded-lg p-2 transition-all",
          focused
            ? "items-start bg-dark-600 shadow-2xl ring-1 ring-secondary/50"
            : "items-center bg-transparent hover:bg-dark-500",
          dimmed && "opacity-50 blur-[2px]",
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
          onFocus={focusProps?.onFocus}
          onBlur={focusProps?.onBlur}
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
