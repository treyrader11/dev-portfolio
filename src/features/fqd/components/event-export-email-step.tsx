"use client";

import { useEffect, useState } from "react";
import {
  RiCloseLine,
  RiLoader4Line,
  RiMailAddLine,
  RiMailSendLine,
  RiArrowLeftLine,
} from "react-icons/ri";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import { cn } from "@/lib/utils";
import type { FqdRecipient } from "@/features/fqd/types/fqd-types";

interface Props {
  ids: string[];
  onBack: () => void;
  onClose: () => void;
}

// Recipient-picker + send step for emailing the selected events' export. Lets
// the admin pick from saved recipients or add a new one inline (saved to the DB)
// before sending.
export function EventExportEmailStep({ ids, onBack, onClose }: Props) {
  const { addNotification } = useNotificationsContext();
  const [recipients, setRecipients] = useState<FqdRecipient[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [newEmail, setNewEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/fqd/recipients");
        const data = await res.json();
        const list: FqdRecipient[] = res.ok ? (data.recipients ?? []) : [];
        setRecipients(list);
        // Pre-select the admin accounts by default.
        setSelected(
          new Set(list.filter((r) => r.isAdmin).map((r) => r.email)),
        );
      } catch {
        setRecipients([]);
      }
    })();
  }, []);

  function toggle(email: string) {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(email)) n.delete(email);
      else n.add(email);
      return n;
    });
  }

  async function addRecipient() {
    const value = newEmail.trim();
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
        setSelected((prev) => new Set(prev).add(value.toLowerCase()));
        setNewEmail("");
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

  async function send() {
    if (sending || selected.size === 0) return;
    setSending(true);
    try {
      const res = await fetch("/api/fqd/events/email-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: [...selected], ids }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        addNotification({
          text: `Emailed ${ids.length} event${ids.length === 1 ? "" : "s"} to ${
            data?.sent ?? selected.size
          } recipient${(data?.sent ?? selected.size) === 1 ? "" : "s"}`,
          variant: "success",
        });
        onClose();
      } else {
        addNotification({
          text: data?.error ?? "Couldn't send email",
          variant: "error",
        });
      }
    } catch {
      addNotification({ text: "Couldn't send email", variant: "error" });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-dark-600 px-5 py-4">
        <div>
          <h3 className="text-sm font-medium text-white">Email export</h3>
          <p className="mt-0.5 text-xs text-light-400">
            Sends a .zip of the listing documents for {ids.length} event
            {ids.length === 1 ? "" : "s"} to the selected recipients.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-light-400 hover:text-white"
        >
          <RiCloseLine className="size-5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        {/* Add a new recipient inline (saved to the recipient list). */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addRecipient()}
            placeholder="Add a new recipient…"
            className="min-w-0 flex-1 rounded-lg border border-dark-600 bg-dark-600 px-3 py-2 text-base text-white outline-none focus:border-secondary placeholder:text-light-400 sm:text-sm"
          />
          <button
            type="button"
            onClick={addRecipient}
            disabled={adding || !newEmail.trim()}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-dark-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-secondary/60 disabled:opacity-50"
          >
            {adding ? (
              <RiLoader4Line className="size-4 animate-spin" />
            ) : (
              <RiMailAddLine className="size-4" />
            )}
            Add
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {recipients === null ? (
            <div className="flex items-center gap-2 py-6 text-sm text-light-400">
              <RiLoader4Line className="size-4 animate-spin" />
              Loading recipients…
            </div>
          ) : recipients.length === 0 ? (
            <p className="py-6 text-center text-sm text-light-400">
              No recipients yet — add one above.
            </p>
          ) : (
            recipients.map((r) => (
              <label
                key={r.email}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                  selected.has(r.email)
                    ? "border-secondary/50 bg-dark-400"
                    : "border-dark-600 hover:border-secondary/40",
                )}
              >
                <input
                  type="checkbox"
                  checked={selected.has(r.email)}
                  onChange={() => toggle(r.email)}
                  className="size-4 shrink-0 accent-secondary"
                />
                <span className="min-w-0 flex-1 truncate text-sm text-white">
                  {r.email}
                </span>
                {r.isAdmin && (
                  <span className="shrink-0 rounded-full bg-secondary/15 px-2 py-0.5 text-xs font-medium text-secondary">
                    Admin
                  </span>
                )}
              </label>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-dark-600 px-5 py-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-light-400 hover:text-white"
        >
          <RiArrowLeftLine className="size-4" />
          Back
        </button>
        <button
          type="button"
          onClick={send}
          disabled={sending || selected.size === 0}
          className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary/90 disabled:opacity-50"
        >
          {sending ? (
            <RiLoader4Line className="size-4 animate-spin" />
          ) : (
            <RiMailSendLine className="size-4" />
          )}
          {sending ? "Sending…" : `Send to ${selected.size}`}
        </button>
      </div>
    </>
  );
}
