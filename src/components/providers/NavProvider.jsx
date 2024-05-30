"use client";

import { NavContext } from "@/lib/contexts";
import { useContext, useState } from "react";

export const NavProvider = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <NavContext.Provider value={{ isNavOpen, setIsNavOpen }}>
      {children}
    </NavContext.Provider>
  );
};

export const useNav = () => useContext(NavContext);
