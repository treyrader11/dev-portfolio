"use client";

import { useContext } from "react";
import useNotifications from "@/hooks/useNotifications";
import { NotificationsContext } from "@/lib/contexts";
import type { NotificationsContextValue } from "@/types/context";

interface NotificationsProviderProps {
  children: React.ReactNode;
}

export const NotificationsProvider = ({ children }: NotificationsProviderProps): React.ReactElement => {
  const notifications = useNotifications();

  return (
    <NotificationsContext.Provider value={notifications}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = (): NotificationsContextValue => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotificationsContext must be used within a NotificationsProvider");
  }
  return context;
};
