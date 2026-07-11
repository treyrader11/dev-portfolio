"use client";

import { useState } from "react";
import { RiLoader4Line } from "react-icons/ri";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import { cn } from "@/lib/utils";
import type { FqdNotificationSettings as Settings } from "../lib/notification-settings";

interface Props {
  initial: Settings;
  currentUserEmail: string;
  emailOptions: string[];
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="mt-0.5 text-xs text-light-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-secondary" : "bg-dark-600",
        )}
      >
        <span
          className={cn(
            "inline-block size-5 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}

// Admin settings for the two event emails. Defaults are on; changes persist to
// SiteConfig so the scheduled cron can read them.
export function FqdNotificationSettings({
  initial,
  currentUserEmail,
  emailOptions,
}: Props) {
  const { addNotification } = useNotificationsContext();
  const [emailOnStart, setEmailOnStart] = useState(initial.emailOnStart);
  const [emailOnEnd, setEmailOnEnd] = useState(initial.emailOnEnd);
  const [recipient, setRecipient] = useState(
    initial.recipientEmail || currentUserEmail || "",
  );
  const [saving, setSaving] = useState(false);

  async function save() {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/fqd/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOnStart,
          emailOnEnd,
          recipientEmail: recipient.trim(),
        }),
      });
      addNotification(
        res.ok
          ? { text: "Notification settings saved", variant: "success" }
          : { text: "Couldn't save settings", variant: "error" },
      );
    } catch {
      addNotification({ text: "Couldn't save settings", variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-8 max-w-2xl rounded-lg border border-dark-600 bg-dark-400 p-6">
      <h2 className="text-lg font-semibold text-white">Email notifications</h2>
      <p className="mt-1 text-sm text-light-400">
        Get emailed about the events you manage. Each email includes the event&apos;s
        full details.
      </p>

      <div className="mt-5 space-y-5">
        <Toggle
          checked={emailOnStart}
          onChange={setEmailOnStart}
          label="When an event starts"
          description="Emailed at the event's start time, with a link to its admin page."
        />
        <Toggle
          checked={emailOnEnd}
          onChange={setEmailOnEnd}
          label="When an event ends"
          description="Emailed after the event ends and is removed from the database."
        />

        <div className="flex flex-col gap-1 border-t border-dark-600 pt-5">
          <label className="text-sm font-medium text-white">Send to</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            {emailOptions.length > 0 && (
              <select
                value={emailOptions.includes(recipient) ? recipient : ""}
                onChange={(e) =>
                  e.target.value && setRecipient(e.target.value)
                }
                className="w-full rounded-lg border border-dark-600 bg-dark-600 px-3 py-2.5 text-sm text-white [color-scheme:dark] transition-all focus:outline-none focus:ring-1 focus:ring-secondary sm:w-1/2"
              >
                <option value="">Choose an account…</option>
                {emailOptions.map((email) => (
                  <option key={email} value={email}>
                    {email}
                  </option>
                ))}
              </select>
            )}
            <input
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="or type an email…"
              className="w-full rounded-lg border border-dark-600 bg-dark-600 px-3 py-2.5 text-sm text-white transition-all focus:outline-none focus:ring-1 focus:ring-secondary sm:w-1/2"
            />
          </div>
          <p className="text-xs text-light-400">
            Pick an account email or type any address. Defaults to your account
            email.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary/80 disabled:opacity-50"
        >
          {saving && <RiLoader4Line className="size-4 animate-spin" />}
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>
    </section>
  );
}
