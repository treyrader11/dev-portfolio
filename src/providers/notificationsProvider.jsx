"use client";

import { createContext, useContext } from "react";
import useNotifications from "@/hooks/useNotifications";

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const notifications = useNotifications();

  return (
    <NotificationsContext.Provider value={notifications}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => useContext(NotificationsContext);
