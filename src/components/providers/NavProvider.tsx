"use client";

import { NavContext } from "@/lib/contexts";
import { useContext, useState } from "react";
import type { NavContextValue } from "@/types/context";

interface NavProviderProps {
  children: React.ReactNode;
}

export const NavProvider = ({ children }: NavProviderProps): React.ReactElement => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  return (
    <NavContext.Provider value={{ isNavOpen, setIsNavOpen }}>
      {children}
    </NavContext.Provider>
  );
};

export const useNav = (): NavContextValue => {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error("useNav must be used within a NavProvider");
  }
  return context;
};
