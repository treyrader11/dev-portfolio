"use client";

import { useContext } from "react";
import useNotifications from "@/hooks/useNotifications";
import { NotificationsContext } from "@/lib/contexts";

export const NotificationsProvider = ({ children }) => {
  const notifications = useNotifications();

  return (
    <NotificationsContext.Provider value={notifications}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => useContext(NotificationsContext);
