import { useState } from "react";
import type { FqdResearchResponse } from "../types/fqd-types";
import { useFqdProvider } from "./use-fqd-provider";

// The successful { data, provider, providerLabel, searchEngine, raw } shape
// returned by both AI endpoints.
export type ResearchResult = FqdResearchResponse;

// Wraps the two AI endpoints (web-search research + raw-text parse). Both use
// the model selected at the top of the page and return the same shape, so the
// panel treats them identically. `error` is a hard failure (red); `notice` is a
// soft, amber message (usage/credits limit reached).
export function useEventResearch() {
  const selected = useFqdProvider((s) => s.provider);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function call(
    endpoint: "/api/fqd/research" | "/api/fqd/parse",
    body: Record<string, string>,
  ): Promise<ResearchResult | null> {
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, provider: selected }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        if (res.status === 429 || data?.code === "quota") {
          setNotice(
            data?.error
              ? `AI usage limit reached — ${data.error}`
              : "AI usage limit reached for this model. Try another model.",
          );
        } else if (res.status === 503 || data?.code === "overloaded") {
          setNotice(
            data?.error ??
              "The AI model is overloaded right now (high demand). Please try again in a moment.",
          );
        } else {
          setError(data?.error ?? "Something went wrong");
        }
        return null;
      }
      return data as ResearchResult;
    } catch {
      setError("Network error");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    notice,
    // Pass the query as the title too so the 7-day research cache can match on
    // it (users search by event name).
    research: (query: string) =>
      call("/api/fqd/research", { query, title: query }),
    parse: (text: string) => call("/api/fqd/parse", { text }),
  };
}
