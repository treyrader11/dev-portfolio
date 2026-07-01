import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { Reorder, useDragControls } from "framer-motion";
import { RiDraggable, RiCloseLine, RiAddLine } from "react-icons/ri";
import AdminLayout from "@/features/admin/components/admin-layout";
import { IconUploadField } from "@/features/admin/components/icon-upload-field";
import { ColorSwatchPicker } from "@/features/admin/components/color-swatch-picker";
import { MonthYearRangePicker } from "@/features/admin/components/month-year-range-picker";
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
      <div className="w-full max-w-3xl">
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

          {/* Tasks — drag the handle to reorder. */}
          <div>
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

          <div className="flex gap-3 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-secondary text-white text-sm font-medium rounded-lg hover:bg-secondary/80 disabled:opacity-50"
            >
              {saving ? "Saving..." : isNew ? "Create" : "Save"}
            </button>
            <button
              onClick={() => router.push("/admin/experience")}
              className="px-4 py-2 text-light-400 text-sm hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
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
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={task}
      dragListener={false}
      dragControls={controls}
      className="flex items-center gap-2 rounded-lg border border-dark-600 bg-dark-500 p-2"
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        onPointerDown={(e) => controls.start(e)}
        className="cursor-grab touch-none text-light-400 hover:text-white active:cursor-grabbing"
      >
        <RiDraggable className="size-5" />
      </button>
      <input
        value={task.value}
        onChange={(e) => onChange(task.id, e.target.value)}
        placeholder="Describe a task or achievement"
        className="flex-1 bg-transparent px-1 py-1 text-sm text-white outline-none placeholder:text-light-400"
      />
      <button
        type="button"
        aria-label="Remove task"
        onClick={() => onRemove(task.id)}
        className="text-red-400 hover:text-red-300"
      >
        <RiCloseLine className="size-5" />
      </button>
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
