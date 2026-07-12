"use client";

import { useEffect, useRef, useState } from "react";
import { RiLoader4Line, RiCheckLine } from "react-icons/ri";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import { cn } from "@/lib/utils";
import { TagsInput } from "./tags-input";
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
  const [emails, setEmails] = useState<string[]>(
    initial.recipientEmails.length
      ? initial.recipientEmails
      : currentUserEmail
        ? [currentUserEmail]
        : [],
  );
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const availableAccounts = emailOptions.filter(
    (e) => !emails.some((x) => x.toLowerCase() === e.toLowerCase()),
  );

  function addEmail(email: string) {
    const v = email.trim();
    if (v && !emails.some((x) => x.toLowerCase() === v.toLowerCase())) {
      setEmails((prev) => [...prev, v]);
    }
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/fqd/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOnStart,
          emailOnEnd,
          recipientEmails: emails,
        }),
      });
      if (res.ok) {
        setDirty(false);
      } else {
        addNotification({ text: "Couldn't save settings", variant: "error" });
      }
    } catch {
      addNotification({ text: "Couldn't save settings", variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  // Auto-save (debounced) whenever a setting changes — skip the first render,
  // since the initial values are already persisted.
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setDirty(true);
    const t = setTimeout(() => void save(), 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailOnStart, emailOnEnd, emails]);

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

        <div className="flex flex-col gap-2 border-t border-dark-600 pt-5">
          <TagsInput
            label="Send to"
            values={emails}
            onChange={setEmails}
            suggestions={emailOptions}
            placeholder="Type an email and press Enter…"
          />
          {availableAccounts.length > 0 && (
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) addEmail(e.target.value);
              }}
              className="w-full rounded-lg border border-dark-600 bg-dark-600 px-3 py-2.5 text-sm text-white [color-scheme:dark] transition-all focus:outline-none focus:ring-1 focus:ring-secondary sm:w-auto"
            >
              <option value="">+ Add an account email…</option>
              {availableAccounts.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>
          )}
          <p className="text-xs text-light-400">
            Add as many recipients as you like — every notification goes to all
            of them. Defaults to your account email.
          </p>
        </div>
      </div>

      {/* Changes auto-save; the button only appears while there are unsaved
          changes (so you can also save immediately). */}
      <div className="mt-6 flex items-center justify-end gap-2 text-sm">
        {saving ? (
          <span className="flex items-center gap-1.5 text-light-400">
            <RiLoader4Line className="size-4 animate-spin" />
            Saving…
          </span>
        ) : dirty ? (
          <button
            type="button"
            onClick={() => void save()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
          >
            Save now
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-light-400">
            <RiCheckLine className="size-4 text-success" />
            All changes saved
          </span>
        )}
      </div>
    </section>
  );
}
