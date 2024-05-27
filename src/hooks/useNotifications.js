"use client";

import { useState, useCallback } from "react";

const NOTIFICATION_TTL = 5000;

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const addNotification = useCallback((notification) => {
    const id = Math.random().toString(36).slice(2, 11);
    const newNotification = { ...notification, id };

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
