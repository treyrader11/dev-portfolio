"use client";

import { useEffect, useState } from "react";
import {
  RiMailAddLine,
  RiLoader4Line,
  RiCloseLine,
  RiMailLine,
} from "react-icons/ri";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import { cn } from "@/lib/utils";
import type { FqdRecipient } from "@/features/fqd/types/fqd-types";

// Admin-home card to manage the common email recipients that event exports can
// be shared with. The admin accounts are always listed and can't be removed.
export function FqdRecipientsCard() {
  const { addNotification } = useNotificationsContext();
  const [recipients, setRecipients] = useState<FqdRecipient[] | null>(null);
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);

  async function load() {
    try {
      const res = await fetch("/api/fqd/recipients");
      const data = await res.json();
      setRecipients(res.ok ? (data.recipients ?? []) : []);
    } catch {
      setRecipients([]);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function add() {
    const value = email.trim();
    if (!value || adding) return;
    setAdding(true);
    try {
      const res = await fetch("/api/fqd/recipients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const data = await res.json();
      if (res.ok) {
        setRecipients(data.recipients);
        setEmail("");
        addNotification({ text: "Recipient added", variant: "success" });
      } else {
        addNotification({
          text: data.error ?? "Couldn't add recipient",
          variant: "error",
        });
      }
    } catch {
      addNotification({ text: "Couldn't add recipient", variant: "error" });
    } finally {
      setAdding(false);
    }
  }

  async function remove(target: string) {
    try {
      const res = await fetch("/api/fqd/recipients", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: target }),
      });
      const data = await res.json();
      if (res.ok) setRecipients(data.recipients);
      else
        addNotification({
          text: data.error ?? "Couldn't remove recipient",
          variant: "error",
        });
    } catch {
      addNotification({ text: "Couldn't remove recipient", variant: "error" });
    }
  }

  return (
    <div className="mt-8 rounded-lg border border-dark-600 bg-dark-400 p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
        <RiMailLine className="size-5 text-secondary" />
        Common recipients
      </h2>
      <p className="mt-1 text-sm text-light-400">
        People you share French Quarter Direct event exports with. Your admin
        accounts are always included; add colleagues here so you can email them
        exports.
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="colleague@example.com"
          // text-base (16px) on mobile stops iOS Safari zooming on focus.
          className="min-w-0 flex-1 rounded-lg border border-dark-600 bg-dark-600 px-3 py-2 text-base text-white outline-none focus:border-secondary placeholder:text-light-400 sm:text-sm"
        />
        <button
          type="button"
          onClick={add}
          disabled={adding || !email.trim()}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary/90 disabled:opacity-50"
        >
          {adding ? (
            <RiLoader4Line className="size-4 animate-spin" />
          ) : (
            <RiMailAddLine className="size-4" />
          )}
          Add recipient
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {recipients === null ? (
          <div className="flex items-center gap-2 py-4 text-sm text-light-400">
            <RiLoader4Line className="size-4 animate-spin" />
            Loading recipients…
          </div>
        ) : recipients.length === 0 ? (
          <p className="py-4 text-sm text-light-400">No recipients yet.</p>
        ) : (
          recipients.map((r) => (
            <div
              key={r.email}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg border border-dark-600 bg-dark-500 px-3 py-2",
              )}
            >
              <span className="truncate text-sm text-white">{r.email}</span>
              {r.isAdmin ? (
                <span className="shrink-0 rounded-full bg-secondary/15 px-2 py-0.5 text-xs font-medium text-secondary">
                  Admin
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => remove(r.email)}
                  aria-label={`Remove ${r.email}`}
                  className="shrink-0 text-light-400 transition-colors hover:text-error"
                >
                  <RiCloseLine className="size-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
