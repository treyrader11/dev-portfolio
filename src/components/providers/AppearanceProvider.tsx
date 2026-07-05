"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Appearance } from "@/types/data";

// Holds the CMS background-noise config, fetched once client-side. null until
// loaded (consumers render no noise until then — a negligible flash for a subtle
// background grain, and it keeps the global footer/headers reactive to CMS
// changes without threading props through every page's data fetching).
const AppearanceContext = createContext<Appearance | null>(null);

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearance] = useState<Appearance | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/appearance")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data) setAppearance(data as Appearance);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <AppearanceContext.Provider value={appearance}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance(): Appearance | null {
  return useContext(AppearanceContext);
}
