"use client";

import { useState } from "react";

export const useSectionValues = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [activeSectionProgress, setActiveSectionProgress] = useState(0);

  return {
    values: {
      activeSection,
      setActiveSection,
      activeSectionProgress,
      setActiveSectionProgress,
    },
  };
};
