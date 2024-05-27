"use client";

import { usePositionValues } from "@/hooks/usePositionValues";
import { PositionContext } from "@/lib/contexts";

export default function PositionProvider({ children }) {
  const { values } = usePositionValues();

  return (
    <PositionContext.Provider value={values}>
      {children}
    </PositionContext.Provider>
  );
}
