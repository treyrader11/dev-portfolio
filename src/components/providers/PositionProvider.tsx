"use client";

import { usePositionValues } from "@/hooks/usePositionValues";
import { PositionContext } from "@/lib/contexts";

interface PositionProviderProps {
  children: React.ReactNode;
}

export default function PositionProvider({ children }: PositionProviderProps): React.ReactElement {
  const { values } = usePositionValues();

  return (
    <PositionContext.Provider value={values}>
      {children}
    </PositionContext.Provider>
  );
}
