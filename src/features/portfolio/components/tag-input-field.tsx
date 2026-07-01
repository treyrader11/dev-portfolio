"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiCloseLine } from "react-icons/ri";
import { cn } from "@/lib/utils";

export interface Suggestion {
  value: string;
  count: number;
}

interface Props {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  suggestions?: Suggestion[];
  placeholder?: string;
  inline?: boolean;
}

// Chip-style tag input modeled on roux-ui's TagInput UX: type and press Enter,
// Tab or comma to add a tag; Backspace removes the last; a suggestions dropdown
// (from existing tags) is keyboard-navigable. Dark-styled to match the admin.
export function TagInputField({
  label,
  value,
  onChange,
  suggestions = [],
  placeholder = "Add tags...",
  inline = false,
}: Props) {
  const tags = value.filter(Boolean);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Suggestions that match the current input and aren't already added.
  const filtered = useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    if (!q) return [];
    return suggestions
      .filter(
        (s) =>
          s.value.toLowerCase().includes(q) &&
          !tags.includes(s.value.toLowerCase()),
      )
      .slice(0, 8);
  }, [inputValue, suggestions, tags]);

  useEffect(() => {
    setSelectedIndex(0);
    setShowSuggestions(filtered.length > 0);
  }, [filtered.length]);

  // Close the dropdown on an outside click.
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function addTag(tag: string) {
    const normalized = tag.toLowerCase().trim();
    if (normalized && !tags.includes(normalized)) {
      onChange([...tags, normalized]);
    }
    setInputValue("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (showSuggestions && filtered.length > 0) addTag(filtered[selectedIndex].value);
      else if (inputValue.trim()) addTag(inputValue);
    } else if (e.key === "," || e.key === "Tab") {
      if (inputValue.trim()) {
        e.preventDefault();
        addTag(inputValue);
      }
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === "ArrowDown" && showSuggestions) {
      e.preventDefault();
      setSelectedIndex((i) => (i < filtered.length - 1 ? i + 1 : i));
    } else if (e.key === "ArrowUp" && showSuggestions) {
      e.preventDefault();
      setSelectedIndex((i) => (i > 0 ? i - 1 : 0));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  }

  return (
    <div className={cn(inline && "flex items-start gap-4")}>
      <label
        className={cn(
          "text-sm font-medium text-white",
          inline ? "w-40 shrink-0 pt-2" : "block mb-1",
        )}
      >
        {label}
      </label>

      <div ref={wrapRef} className={cn("relative", inline && "min-w-0 flex-1")}>
        <div className="flex min-h-[42px] w-full flex-wrap items-center gap-2 rounded-lg border border-dark-600 px-3 py-2 focus-within:border-secondary/60">
          {tags.map((tag) => (
            <motion.span
              key={tag}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 rounded-md bg-dark-600 px-2 py-1 text-sm font-medium text-white"
            >
              <span>#{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tag}`}
                className="rounded p-0.5 text-light-400 transition-colors hover:text-white"
              >
                <RiCloseLine className="size-3.5" />
              </button>
            </motion.span>
          ))}
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ""}
            className="min-w-[120px] flex-1 bg-transparent text-sm text-white outline-none placeholder:text-light-400"
          />
        </div>

        <AnimatePresence>
          {showSuggestions && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-dark-600 bg-dark-500 shadow-lg"
            >
              {filtered.map((s, i) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => addTag(s.value)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors",
                    selectedIndex === i ? "bg-dark-400" : "hover:bg-dark-400",
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-medium",
                      selectedIndex === i ? "text-secondary" : "text-white",
                    )}
                  >
                    #{s.value}
                  </span>
                  <span className="text-xs text-light-400">
                    {s.count} {s.count === 1 ? "use" : "uses"}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-1 text-xs text-light-400">
          Type and press Enter, Tab, or comma to add tags
        </p>
      </div>
    </div>
  );
}
