"use client";

import { RiSparkling2Line } from "react-icons/ri";
import { cn } from "@/lib/utils";
import {
  FQD_PROVIDERS,
  FQD_PROVIDER_LABEL,
  FQD_PROVIDER_DOT,
  parseFqdProvider,
} from "../types/fqd-types";
import { useFqdProvider } from "../hooks/use-fqd-provider";

// Top-of-page model picker. The chosen model is used by every AI action on the
// create-event page (research, per-field search, classification, images,
// discovery).
export function FqdProviderSelect({ className }: { className?: string }) {
  const provider = useFqdProvider((s) => s.provider);
  const setProvider = useFqdProvider((s) => s.setProvider);

  return (
    <div
      className={cn(
        "mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-dark-600 bg-dark-400 px-4 py-3",
        className,
      )}
    >
      <span className="flex items-center gap-2 text-sm font-medium text-white">
        <RiSparkling2Line className="size-4 text-secondary" />
        AI model
      </span>
      <div className="relative flex items-center gap-2">
        <span
          className={cn(
            "size-2 shrink-0 rounded-full",
            FQD_PROVIDER_DOT[provider],
          )}
        />
        <select
          value={provider}
          onChange={(e) =>
            setProvider(parseFqdProvider(e.target.value) ?? "gemini")
          }
          aria-label="AI model"
          className="rounded-lg border border-dark-600 bg-dark-600 px-3 py-1.5 text-sm text-white outline-none focus:border-secondary"
        >
          {FQD_PROVIDERS.map((p) => (
            <option key={p} value={p}>
              {FQD_PROVIDER_LABEL[p]}
              {p === "gemini" ? " — free" : ""}
            </option>
          ))}
        </select>
      </div>
      <span className="text-xs text-light-400">
        Used by every AI action on this page.
      </span>
    </div>
  );
}
