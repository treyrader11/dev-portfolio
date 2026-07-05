"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useWindowDimensions";
import { useAppearance } from "@/components/providers/AppearanceProvider";
import FuzzyOverlay from "@/components/Hero/FuzzyOverlay";
import type { AppearanceArea } from "@/types/data";

interface Props {
  // Which configured area this instance represents.
  area: AppearanceArea;
  // Extra classes for the clip layer — typically a z-index (e.g. "-z-10" behind
  // the footer, "z-0" behind the hero). Its parent must be relative.
  className?: string;
}

// Renders the black-noise grain for an area only when the CMS has it enabled
// (bg === "noise") AND it's enabled for the current device. Self-contained: it
// clips the oversized grain to its parent's box, so a consumer just drops it
// inside a relative container behind its content.
export default function NoiseBg({ area, className }: Props) {
  const appearance = useAppearance();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !appearance) return null;
  const cfg = appearance[area];
  if (!cfg || cfg.bg !== "noise") return null;
  if (!(isMobile ? cfg.devices.mobile : cfg.devices.desktop)) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <FuzzyOverlay />
    </div>
  );
}
