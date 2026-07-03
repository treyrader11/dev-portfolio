import {
  createContext,
  useContext,
  useId,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RiLinkedinFill, RiGithubFill, RiYoutubeFill } from "react-icons/ri";
import AdminLayout from "@/features/admin/components/admin-layout";
import { IconUploadField } from "@/features/admin/components/icon-upload-field";
import { cn } from "@/lib/utils";
import type { UserData } from "@/types/data";

interface Props {
  data: UserData;
}

// Task-focus "blur mode": the focused field lifts above a blurred backdrop while
// every other field dims — shared via context so any Field can opt in.
const FocusContext = createContext<{
  focusedId: string | null;
  setFocusedId: Dispatch<SetStateAction<string | null>>;
}>({ focusedId: null, setFocusedId: () => {} });

export function AdminProfilePage({ data }: Props) {
  const [form, setForm] = useState(data);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [message, setMessage] = useState("");
  const [focusedId, setFocusedId] = useState<string | null>(null);

  function update(path: string, value: string | string[]) {
    setForm((prev) => {
      const copy = structuredClone(prev);
      const keys = path.split(".");
      let obj: Record<string, unknown> = copy as unknown as Record<
        string,
        unknown
      >;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]] as Record<string, unknown>;
      }
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/config/userData", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: form }),
      });
      setMessage(res.ok ? "Saved successfully!" : "Failed to save.");
    } catch {
      setMessage("An error occurred.");
    }
    setSaving(false);
  }

  // Remove the saved override so the whole app falls back to the current/default
  // values, then reload to pull those defaults back into the form.
  async function resetToDefaults() {
    setResetting(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/config/userData", {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("Reset to defaults. Reloading…");
        window.location.reload();
        return;
      }
      setMessage("Failed to reset.");
    } catch {
      setMessage("An error occurred.");
    }
    setResetting(false);
    setConfirmReset(false);
  }

  return (
    <AdminLayout title="Profile & Hero">
      <FocusContext.Provider value={{ focusedId, setFocusedId }}>
        {/* Blurred backdrop while a field is focused. */}
        <AnimatePresence>
          {focusedId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
          )}
        </AnimatePresence>

        <div className="w-full max-w-5xl space-y-8">
          {/* Profile photo — header avatar + social share cards. */}
          <Section title="Profile Photo">
            <IconUploadField
              label="Avatar"
              value={form.avatarUrl ?? ""}
              previewBg="#141516"
              aspect={1}
              folder="profile"
              onChange={(url) => update("avatarUrl", url)}
            />
            <p className="text-xs text-light-400">
              Shown as the site header avatar and in link share previews. If left
              empty, the default headshot is used.
            </p>
          </Section>

          <Section title="Basic Information">
            <Field
              label="Name"
              required
              value={form.name}
              onChange={(v) => update("name", v)}
            />
            <Field
              label="Designation"
              required
              value={form.designation}
              onChange={(v) => update("designation", v)}
            />
            <Field
              label="Email"
              required
              value={form.email}
              onChange={(v) => update("email", v)}
            />
            <Field
              label="Phone"
              value={form.phone}
              onChange={(v) => update("phone", v)}
            />
            <Field
              label="Address"
              value={form.address}
              onChange={(v) => update("address", v)}
            />
            <Field
              label="GitHub Username"
              value={form.githubUsername}
              onChange={(v) => update("githubUsername", v)}
            />
            <Field
              label="Resume URL"
              value={form.resumeUrl}
              onChange={(v) => update("resumeUrl", v)}
            />
          </Section>

          <Section title="Social Links">
            <Field
              label="LinkedIn"
              icon={<RiLinkedinFill className="size-4" />}
              value={form.socialLinks.linkedin}
              onChange={(v) => update("socialLinks.linkedin", v)}
            />
            <Field
              label="GitHub"
              icon={<RiGithubFill className="size-4" />}
              value={form.socialLinks.github}
              onChange={(v) => update("socialLinks.github", v)}
            />
            <Field
              label="YouTube"
              icon={<RiYoutubeFill className="size-4" />}
              value={form.socialLinks.youtube}
              onChange={(v) => update("socialLinks.youtube", v)}
            />
          </Section>

          <Section title="Hero Section">
            <Field
              label="Hero Phrase"
              required
              value={form.hero.phrase}
              onChange={(v) => update("hero.phrase", v)}
            />
          </Section>

          <Section title="About Section">
            <Field
              label="About Title"
              required
              value={form.about.title}
              onChange={(v) => update("about.title", v)}
            />
            <Field
              label="Current Project"
              value={form.about.current_project}
              onChange={(v) => update("about.current_project", v)}
            />
            <Field
              label="Current Project URL"
              value={form.about.current_project_url}
              onChange={(v) => update("about.current_project_url", v)}
            />
            <TextArrayField
              label="Description Paragraphs"
              required
              value={form.about.description}
              onChange={(v) => update("about.description", v)}
            />
            <TextArrayField
              label="Concise Description"
              value={form.about.description_concise}
              onChange={(v) => update("about.description_concise", v)}
            />
          </Section>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-success px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-success-600 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            {confirmReset ? (
              <div className="relative z-50 flex flex-wrap items-center gap-2 rounded-lg border border-dark-600 bg-dark-500 px-3 py-2">
                <span className="text-sm text-light-400">
                  Reset all fields to their defaults and remove your saved
                  changes?
                </span>
                <button
                  onClick={resetToDefaults}
                  disabled={resetting}
                  className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-white hover:bg-secondary/80 disabled:opacity-50"
                >
                  {resetting ? "Resetting..." : "Yes, reset"}
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-2 text-sm text-light-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="rounded-lg border border-secondary px-6 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-secondary hover:text-white"
              >
                Reset to Defaults
              </button>
            )}

            {message && (
              <p
                className={cn(
                  "text-sm",
                  message.includes("success") || message.includes("Reset")
                    ? "text-success"
                    : "text-error",
                )}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </FocusContext.Provider>
    </AdminLayout>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dark-600 bg-dark-400 p-6">
      <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// Label showing a required asterisk or an "(optional)" hint, plus optional icon.
function FieldLabel({
  label,
  required,
  icon,
}: {
  label: string;
  required?: boolean;
  icon?: ReactNode;
}) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-white">
      {icon && <span className="text-light-400">{icon}</span>}
      {label}
      {required ? (
        <span className="text-error">*</span>
      ) : (
        <span className="font-normal text-light-400">(optional)</span>
      )}
    </label>
  );
}

// Wraps a field in the focus-blur behaviour: focused = lifted above the backdrop,
// another field focused = dimmed/blurred.
function useFocusState() {
  const id = useId();
  const { focusedId, setFocusedId } = useContext(FocusContext);
  const isFocused = focusedId === id;
  const dimmed = focusedId !== null && !isFocused;
  return {
    isFocused,
    dimmed,
    onFocus: () => setFocusedId(id),
    onBlur: () => setFocusedId((prev) => (prev === id ? null : prev)),
  };
}

const CONTROL =
  "w-full rounded-lg border border-dark-600 bg-dark-500 px-3 py-2 text-sm text-white focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/40";

function Field({
  label,
  value,
  onChange,
  required,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  icon?: ReactNode;
}) {
  const { isFocused, dimmed, onFocus, onBlur } = useFocusState();
  return (
    <div
      className={cn(
        "flex flex-col gap-1 transition-all duration-200",
        isFocused && "relative z-50",
        dimmed && "opacity-50 blur-[2px]",
      )}
    >
      <FieldLabel label={label} required={required} icon={icon} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        className={CONTROL}
      />
    </div>
  );
}

function TextArrayField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  required?: boolean;
}) {
  const { isFocused, dimmed, onFocus, onBlur } = useFocusState();
  return (
    <div
      className={cn(
        "flex flex-col gap-1 transition-all duration-200",
        isFocused && "relative z-50",
        dimmed && "opacity-50 blur-[2px]",
      )}
    >
      <FieldLabel label={label} required={required} />
      {value.map((item, i) => (
        <div key={i} className="mb-2 flex gap-2">
          <textarea
            value={item}
            onChange={(e) => {
              const next = [...value];
              next[i] = e.target.value;
              onChange(next);
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            rows={3}
            className={cn(CONTROL, "flex-1")}
          />
          <button
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            className="px-2 text-sm text-error hover:text-error-600"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...value, ""])}
        className="self-start text-sm text-secondary hover:text-secondary/80"
      >
        + Add paragraph
      </button>
    </div>
  );
}
