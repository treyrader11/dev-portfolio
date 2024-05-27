"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle, FiX } from "react-icons/fi";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";

export default function Notifications() {
  const { notifications, removeNotification } = useNotificationsContext();

  return (
    <div
      className={cn(
        "bg-slate-900",
        "min-h-[200px]",
        "flex",
        "items-center",
        "justify-center"
      )}
    >
      <AnimatePresence>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            removeNotif={removeNotification}
            {...notification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

const NOTIFICATION_TTL = 5000;

export function Notification({ text, id, removeNotif }) {
  console.log("id", id);
  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      removeNotif(id);
    }, NOTIFICATION_TTL);

    return () => clearTimeout(timeoutRef);
  }, [id, removeNotif]);

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
        "bg-emerald-500",
        "fixed",
        "z-50",
        "bottom-4",
        "right-4"
      )}
    >
      <FiAlertCircle
        className={cn(
          "text-3xl",
          "absolute",
          "-top-4",
          "-left-4",
          "p-2",
          "rounded-full",
          "bg-white",
          // "text-purple-600",
          "text-emerald-500",
          "shadow"
        )}
      />
      <span>{text}</span>
      <button onClick={() => removeNotif(id)} className="ml-auto mt-0.5">
        <FiX />
      </button>
    </motion.div>
  );
}
