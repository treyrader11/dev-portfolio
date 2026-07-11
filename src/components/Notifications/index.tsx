"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import type { Notification as NotificationType } from "@/types/hooks";

export default function Notifications() {
  const { notifications, removeNotification } = useNotificationsContext();

  // Toasts are fixed-positioned, so this only hosts them (no layout box).
  return (
    <AnimatePresence>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          removeNotif={removeNotification}
          {...notification}
        />
      ))}
    </AnimatePresence>
  );
}

const NOTIFICATION_TTL = 5000;

interface NotificationProps extends NotificationType {
  removeNotif: (id: string) => void;
}

export function Notification({
  text,
  id,
  variant = "success",
  removeNotif,
}: NotificationProps) {
  const isError = variant === "error";

  useEffect(() => {
    // Error toasts stay until manually dismissed via the X.
    if (isError) return;
    const timeoutRef = setTimeout(() => {
      removeNotif(id);
    }, NOTIFICATION_TTL);

    return () => clearTimeout(timeoutRef);
  }, [id, removeNotif, isError]);
  const Icon = isError ? FiAlertCircle : FiCheckCircle;

  return (
    <motion.div
      layout
      initial={{ y: 15, scale: 0.9, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      exit={{ y: -25, scale: 0.9, opacity: 0 }}
      transition={{ type: "spring" }}
      className={cn(
        "p-4",
        "w-80",
        "flex",
        "items-start",
        "rounded-lg",
        "gap-2",
        "text-sm",
        "font-medium",
        "shadow-lg",
        "text-white",
        "fixed",
        "z-50",
        "bottom-4",
        "right-4",
        isError ? "bg-red-500" : "bg-emerald-500"
      )}
    >
      <Icon
        className={cn(
          "text-3xl",
          "absolute",
          "-top-4",
          "-left-4",
          "p-2",
          "rounded-full",
          "bg-white",
          "shadow",
          isError ? "text-red-500" : "text-emerald-500"
        )}
      />
      <span>{text}</span>
      <button onClick={() => removeNotif(id)} className="ml-auto mt-0.5">
        <FiX />
      </button>
    </motion.div>
  );
}
