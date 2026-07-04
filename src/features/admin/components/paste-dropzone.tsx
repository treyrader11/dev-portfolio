import { useState, type DragEvent } from "react";
import { RiClipboardLine } from "react-icons/ri";
import { cn } from "@/lib/utils";

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
// to onText for deterministic parsing. Kept dumb/reusable across features.
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
    <div className="flex flex-col gap-1">
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
          dragOver ? "border-secondary bg-dark-600" : "border-dark-600",
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
    </div>
  );
}
