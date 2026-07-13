"use client";

import { useEffect, useState } from "react";
import {
  RiSparkling2Line,
  RiLoader4Line,
  RiCheckLine,
  RiExternalLinkLine,
} from "react-icons/ri";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import { cn } from "@/lib/utils";
import {
  FQD_PROVIDER_LABEL,
  parseFqdProvider,
  type FqdProvider,
} from "@/features/fqd/types/fqd-types";

// The default AI model used across the app (FQD research/discovery + AI job
// search). Selecting one auto-saves to SiteConfig and toasts — no Save button.
// Self-contained (its own fetch/save), deliberately not built on the profile
// form logic.
const AI_PROVIDER_OPTIONS: {
  value: FqdProvider;
  hint: string;
  // The provider's console/dashboard, for managing API keys, credits & usage.
  consoleUrl: string;
  consoleLabel: string;
}[] = [
  {
    value: "gemini",
    hint: "Free tier — default",
    consoleUrl: "https://aistudio.google.com/",
    consoleLabel: "Google AI Studio",
  },
  {
    value: "anthropic",
    hint: "Paid",
    consoleUrl: "https://console.anthropic.com/",
    consoleLabel: "Anthropic Console",
  },
  {
    value: "openai",
    hint: "Paid",
    consoleUrl: "https://platform.openai.com/",
    consoleLabel: "OpenAI Platform",
  },
];

const AI_SETTINGS_KEY = "aiSettings";

export function DefaultAiModelCard() {
  const { addNotification } = useNotificationsContext();
  const [provider, setProvider] = useState<FqdProvider | null>(null);
  const [saving, setSaving] = useState<FqdProvider | null>(null);

  // Load the saved default (404 = never set → Gemini).
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/config/${AI_SETTINGS_KEY}`);
        if (res.ok) {
          const row = await res.json();
          const saved = parseFqdProvider(row?.value?.defaultProvider);
          setProvider(saved ?? "gemini");
        } else {
          setProvider("gemini");
        }
      } catch {
        setProvider("gemini");
      }
    })();
  }, []);

  async function choose(next: FqdProvider) {
    if (next === provider || saving) return;
    const prev = provider;
    setProvider(next); // optimistic
    setSaving(next);
    try {
      const res = await fetch(`/api/admin/config/${AI_SETTINGS_KEY}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: { defaultProvider: next } }),
      });
      if (!res.ok) throw new Error();
      addNotification({
        text: `Default AI model set to ${FQD_PROVIDER_LABEL[next]}`,
        variant: "success",
      });
    } catch {
      setProvider(prev); // revert on failure
      addNotification({
        text: "Couldn't update the default AI model",
        variant: "error",
      });
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="mb-8 rounded-lg border border-dark-600 bg-dark-400 p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
        <RiSparkling2Line className="size-5 text-secondary" />
        Default AI model
      </h2>
      <p className="mt-1 text-sm text-light-400">
        The model every AI feature uses by default — French Quarter Direct event
        research and discovery, and AI job search. Changes save automatically.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {provider === null
          ? AI_PROVIDER_OPTIONS.map((o) => (
              <div
                key={o.value}
                className="h-[4.25rem] animate-pulse rounded-lg border border-dark-600 bg-dark-600"
              />
            ))
          : AI_PROVIDER_OPTIONS.map((o) => {
              const active = provider === o.value;
              const busy = saving === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => choose(o.value)}
                  disabled={!!saving}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-lg border px-4 py-3 text-left transition-colors disabled:cursor-not-allowed",
                    active
                      ? "border-secondary bg-secondary/15"
                      : "border-dark-600 bg-dark-500 hover:border-secondary/60",
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-white">
                      {FQD_PROVIDER_LABEL[o.value]}
                    </span>
                    <span className="block text-xs text-light-400">
                      {o.hint}
                    </span>
                  </span>
                  {busy ? (
                    <RiLoader4Line className="size-4 shrink-0 animate-spin text-secondary" />
                  ) : (
                    <RiCheckLine
                      className={cn(
                        "size-4 shrink-0 text-secondary",
                        active ? "opacity-100" : "opacity-0",
                      )}
                    />
                  )}
                </button>
              );
            })}
      </div>

      {/* Provider consoles — manage API keys, credits & usage for each model. */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-dark-600 pt-4 text-xs">
        <span className="text-light-400">Manage keys, credits &amp; usage:</span>
        {AI_PROVIDER_OPTIONS.map((o) => (
          <a
            key={o.value}
            href={o.consoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-secondary transition-colors hover:text-white hover:underline"
          >
            {o.consoleLabel}
            <RiExternalLinkLine className="size-3.5" />
          </a>
        ))}
      </div>
    </div>
  );
}
