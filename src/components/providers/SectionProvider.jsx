"use client";

import { useSectionValues } from "@/hooks/useSectionValues";
import { SectionContext } from "@/lib/contexts";

export default function SectionProvider({ children }) {
  const { values } = useSectionValues();

  return (
    <SectionContext.Provider value={values}>{children}</SectionContext.Provider>
  );
}
