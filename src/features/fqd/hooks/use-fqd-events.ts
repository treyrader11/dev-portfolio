import { useState } from "react";
import type { FqdEventListItem } from "../types/fqd-types";

// Derives the visible list from the current SSR data (so pagination works)
// minus any rows deleted this session.
export function useFqdEvents(all: FqdEventListItem[]) {
  const [deleted, setDeleted] = useState<Set<string>>(new Set());
  const events = all.filter((e) => !deleted.has(e.id));

  async function removeEvent(id: string): Promise<boolean> {
    const res = await fetch(`/api/fqd/events/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDeleted((prev) => new Set(prev).add(id));
      return true;
    }
    return false;
  }

  return { events, removeEvent };
}
