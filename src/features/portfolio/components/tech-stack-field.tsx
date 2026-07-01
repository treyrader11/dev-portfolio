"use client";

import { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { RiAddLine, RiArrowDownSLine, RiImageLine } from "react-icons/ri";
import { IconUploadField } from "@/features/admin/components/icon-upload-field";
import { cn } from "@/lib/utils";

interface Skill {
  id: string;
  skillName: string;
  imageUrl: string;
}

interface Props {
  label: string;
  /** The selected tech image URL (stored on the project as techImage). */
  value: string;
  onChange: (imageUrl: string) => void;
  /** Optional: also receive the chosen tech's name (e.g. to set the stack). */
  onSelectName?: (name: string) => void;
  /** Render the label inline (to the left) instead of stacked above. */
  inline?: boolean;
}

// Tech-stack picker: choose an existing tech (its logo becomes the value) or add
// a new one by uploading + cropping a logo, which is persisted to the Skills
// table so it's reusable next time.
export function TechStackField({
  label,
  value,
  onChange,
  onSelectName,
  inline = false,
}: Props) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/skills")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Skill[]) => setSkills(data))
      .catch(() => setSkills([]));
  }, []);

  const selected = skills.find((s) => s.imageUrl === value);

  function pick(skill: Skill) {
    onChange(skill.imageUrl);
    onSelectName?.(skill.skillName);
    setOpen(false);
  }

  async function addNew() {
    if (!newName.trim() || !newImage) return;
    setSaving(true);
    const res = await fetch("/api/admin/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skillName: newName.trim(), imageUrl: newImage }),
    });
    setSaving(false);
    if (res.ok) {
      const created = (await res.json()) as Skill;
      setSkills((prev) => [...prev, created]);
      onChange(created.imageUrl);
      onSelectName?.(created.skillName);
      setAdding(false);
      setNewName("");
      setNewImage("");
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

      <div className={cn(inline && "min-w-0 flex-1")}>
        <div className="flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={selected?.skillName ?? "Tech"}
            className="size-12 rounded-lg border border-dark-600 bg-white object-contain p-1.5"
          />
        ) : (
          <div className="flex size-12 items-center justify-center rounded-lg border border-dashed border-dark-600 text-light-400">
            <RiImageLine className="size-5" />
          </div>
        )}

        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-between rounded-lg border border-dark-600 px-3 py-2 text-sm text-white transition-colors hover:border-secondary/60"
            >
              {selected?.skillName ?? (value ? "Custom" : "Select tech stack")}
              <RiArrowDownSLine className="size-4 text-light-400" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              sideOffset={6}
              align="start"
              className="z-[110] max-h-72 w-72 overflow-auto rounded-xl border border-dark-600 bg-dark-500 p-2 shadow-xl"
            >
              {skills.length === 0 && (
                <p className="px-2 py-3 text-xs text-light-400">
                  No tech stacks yet — add one below.
                </p>
              )}
              <div className="grid grid-cols-1">
                {skills.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => pick(skill)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-dark-400",
                      selected?.id === skill.id
                        ? "text-white"
                        : "text-light-400",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={skill.imageUrl}
                      alt=""
                      className="size-6 rounded bg-white object-contain p-0.5"
                    />
                    <span className="truncate">{skill.skillName}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setAdding(true);
                  setOpen(false);
                }}
                className="mt-1 flex w-full items-center gap-1.5 border-t border-dark-600 px-2 pt-2 text-sm text-blue-400 hover:text-blue-300"
              >
                <RiAddLine className="size-4" /> Add new tech stack
              </button>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      {/* Inline add form — name + upload/crop a logo, persisted as a Skill. */}
      {adding && (
        <div className="mt-3 space-y-3 rounded-lg border border-dark-600 p-3">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Tech name
            </label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Next.js"
              className="w-full px-3 py-2 border border-dark-600 rounded-lg text-sm"
            />
          </div>
          <IconUploadField
            label="Logo"
            value={newImage}
            onChange={setNewImage}
            folder="portfolio/tech"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addNew}
              disabled={saving || !newName.trim() || !newImage}
              className="rounded-lg bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success-600 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Add tech stack"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setNewName("");
                setNewImage("");
              }}
              className="px-4 py-2 text-sm text-light-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
