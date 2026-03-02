"use client";

import { useState, useCallback } from "react";
import type { Notification, UseNotificationsReturn } from "@/types/hooks";

const NOTIFICATION_TTL = 5000;

const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string): void => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, "id">): void => {
    const id = Math.random().toString(36).slice(2, 11);
    const newNotification: Notification = { ...notification, id };

    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      removeNotification(id);
    }, NOTIFICATION_TTL);
  }, [removeNotification]);



  return {
    notifications,
    addNotification,
    removeNotification,
  };
};

export default useNotifications;
