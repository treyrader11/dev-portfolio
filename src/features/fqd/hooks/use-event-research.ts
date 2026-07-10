import { useState } from "react";
import type { EventResearch } from "../types/fqd-types";

export interface ResearchResult {
  fields: EventResearch;
  raw: string;
}

// Wraps the two AI endpoints (web-search research + raw-text parse). Both return
// the same { fields, raw } shape, so the panel treats them identically.
export function useEventResearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function call(
    endpoint: "/api/fqd/research" | "/api/fqd/parse",
    body: Record<string, string>,
  ): Promise<ResearchResult | null> {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong");
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
    research: (query: string) => call("/api/fqd/research", { query }),
    parse: (text: string) => call("/api/fqd/parse", { text }),
  };
}
