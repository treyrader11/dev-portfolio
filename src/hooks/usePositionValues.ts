"use client";

import { useState } from "react";
import type { UsePositionValuesReturn } from "@/types/hooks";

export const usePositionValues = (): UsePositionValuesReturn => {
  const [activePosition, setActivePosition] = useState<number>(0);
  const [activePositionProgress, setActivePositionProgress] = useState<number>(0);

  return {
    values: {
      activePosition,
      setActivePosition,
      activePositionProgress,
      setActivePositionProgress,
    },
  };
};
