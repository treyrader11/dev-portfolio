import { useId, useState, type DragEvent } from "react";
import { motion } from "framer-motion";
import { RiClipboardLine } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { useFocusExpandContext } from "@/hooks/use-focus-expand";

interface Props {
  label: string;
  placeholder?: string;
  hint?: string;
  // Called with the raw pasted/dropped text. The caller parses it (env keys,
  // package.json deps, etc.) and updates its own state.
  onText: (text: string) => void;
  // Optional status line shown under the box, e.g. "12 keys detected".
  status?: string;
  // true renders the status in red (parse error).
  error?: boolean;
}

// A paste-or-drop target for config files. Paste directly into the textarea, or
// drag a file (.env, package.json) onto it — either way the raw text is handed
// to onText for deterministic parsing. Participates in the admin focus-expand
// system so, when focused, it lifts above the blur backdrop and stays fully
// interactive (otherwise the backdrop sits over it and it reads as disabled).
export function PasteDropzone({
  label,
  placeholder,
  hint,
  onText,
  status,
  error,
}: Props) {
  const [value, setValue] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const id = useId();
  const focus = useFocusExpandContext();
  const focused = focus?.isFocused(id) ?? false;
  const dimmed = focus?.isDimmed(id) ?? false;
  const fp = focus?.getFocusProps(id);

  function emit(text: string) {
    setValue(text);
    onText(text);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      file.text().then(emit).catch(() => {});
    } else {
      const text = e.dataTransfer.getData("text");
      if (text) emit(text);
    }
  }

  return (
    <motion.div
      animate={{ scale: focused ? 1.01 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className={cn(
        "flex flex-col gap-1",
        focused && "relative z-50",
        dimmed && "opacity-50 blur-[2px]",
      )}
    >
      <label className="text-sm font-medium text-white">{label}</label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "rounded-lg border border-dashed transition-colors",
          dragOver || focused ? "border-secondary bg-dark-600" : "border-dark-600",
        )}
      >
        <div className="flex items-center gap-1.5 px-3 pt-2 text-xs text-light-400">
          <RiClipboardLine className="size-3.5" />
          Paste here or drop a file
        </div>
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => emit(e.target.value)}
          onFocus={fp?.onFocus}
          onBlur={fp?.onBlur}
          rows={4}
          spellCheck={false}
          className="w-full resize-y bg-transparent px-3 pb-3 pt-1 font-mono text-xs text-white outline-none placeholder:text-light-400"
        />
      </div>
      {(status || hint) && (
        <p className={cn("text-xs", error ? "text-red-400" : "text-light-400")}>
          {status ?? hint}
        </p>
      )}
    </motion.div>
  );
}
