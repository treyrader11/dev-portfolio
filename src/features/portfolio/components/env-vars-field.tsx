"use client";

import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { ADMIN_FIELD_CONTROL } from "@/features/admin/components/admin-field";
import { parseEnvKeys } from "@/features/portfolio/lib/parse-config";

interface Props {
  label: string;
  hint?: string;
  value: string[];
  onChange: (value: string[]) => void;
}

// Environment variable editor. Paste a whole .env (KEY=VALUE lines) and it
// splits into individual, removable items in one go — or type a single KEY_NAME
// and press Enter. Only the names are kept (values are dropped) since the public
// page renders KEY="". Deduplicates.
export function EnvVarsField({ label, hint, value, onChange }: Props) {
  const items = value.filter(Boolean);
  const [draft, setDraft] = useState("");

  function addFrom(text: string) {
    const keys = parseEnvKeys(text);
    if (keys.length === 0) return;
    const merged = [...items];
    for (const k of keys) if (!merged.includes(k)) merged.push(k);
    onChange(merged);
    setDraft("");
  }

  function removeAt(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white">{label}</label>
      {hint && <p className="text-xs text-light-400">{hint}</p>}

      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex items-center gap-1 rounded-md bg-dark-600 px-2 py-1 font-mono text-sm text-white"
            >
              {item}
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label={`Remove ${item}`}
                className="rounded p-0.5 text-light-400 transition-colors hover:text-white"
              >
                <RiCloseLine className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onPaste={(e) => {
          const text = e.clipboardData.getData("text");
          // A multi-var paste (newlines or KEY=VALUE) is split into items right
          // away; a single bare name falls through to normal paste + Enter.
          if (/[\n=]/.test(text) || text.trim().split(/\s+/).length > 1) {
            e.preventDefault();
            addFrom(text);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addFrom(draft);
          }
        }}
        placeholder="Paste your .env here, or type a KEY_NAME and press Enter"
        className={cn(ADMIN_FIELD_CONTROL, "font-mono")}
      />
    </div>
  );
}
