"use client";

import { useState } from "react";

export const usePositionValues = () => {
  const [activePosition, setActivePosition] = useState(0);
  const [activePositionProgress, setActivePositionProgress] = useState(0);

  return {
    values: {
      activePosition,
      setActivePosition,
      activePositionProgress,
      setActivePositionProgress,
    },
  };
};
