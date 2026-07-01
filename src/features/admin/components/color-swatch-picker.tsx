"use client";

import { RiCheckLine } from "react-icons/ri";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}

// Colors drawn from the app's Tailwind palette (see tailwind.config.ts) plus
// pure black/white, so icon backgrounds stay on-brand. The hex is stored under
// the hood but never shown — the user only ever sees the swatches.
const SWATCHES: { name: string; value: string }[] = [
  { name: "White", value: "#ffffff" },
  { name: "Sand", value: "#afa18f" },
  { name: "Gray", value: "#999999" },
  { name: "Primary", value: "#ec4e39" },
  { name: "Secondary", value: "#934e00" },
  { name: "Fuchsia", value: "#d946ef" },
  { name: "Card", value: "#1c1c1c" },
  { name: "Panel", value: "#141516" },
  { name: "Border", value: "#292929" },
  { name: "Black", value: "#0f0f0f" },
];

export function ColorSwatchPicker({ label, value, onChange }: Props) {
  const current = value.toLowerCase();
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2.5">
        {SWATCHES.map((swatch) => {
          const isSelected = current === swatch.value.toLowerCase();
          const isLight = ["#ffffff", "#afa18f"].includes(swatch.value);
          return (
            <button
              key={swatch.value}
              type="button"
              aria-label={swatch.name}
              title={swatch.name}
              onClick={() => onChange(swatch.value)}
              style={{ backgroundColor: swatch.value }}
              className={cn(
                // "Squircle" — a squashed rounded square, no hex/rgb shown.
                "flex size-9 items-center justify-center rounded-[30%] border border-white/10 transition-transform hover:scale-105",
                isSelected &&
                  "ring-2 ring-white ring-offset-2 ring-offset-dark-400",
              )}
            >
              {isSelected && (
                <RiCheckLine
                  className={cn(
                    "size-4",
                    isLight ? "text-black" : "text-white",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
