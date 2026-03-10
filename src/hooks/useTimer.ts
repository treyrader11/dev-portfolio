import { useState, useEffect, useCallback, useRef } from "react";
import type { TimeEntryData } from "@/types/invoice";

export function useTimer() {
  const [activeEntry, setActiveEntry] = useState<TimeEntryData | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isRunning = !!activeEntry && !activeEntry.endTime;

  // Check for active timer on mount
  useEffect(() => {
    fetch("/api/admin/time-entries/active")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setActiveEntry(data);
        }
      })
      .catch(() => {});
  }, []);

  // Update elapsed time every second
  useEffect(() => {
    if (isRunning && activeEntry) {
      const start = new Date(activeEntry.startTime).getTime();
      const updateElapsed = () => {
        setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
      };
      updateElapsed();
      intervalRef.current = setInterval(updateElapsed, 1000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      setElapsedSeconds(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isRunning, activeEntry]);

  const startTimer = useCallback(
    async (
      ticketKey: string,
      ticketSummary: string,
      projectKey?: string,
      projectName?: string
    ) => {
      const res = await fetch("/api/admin/time-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketKey,
          ticketSummary,
          projectKey,
          projectName,
        }),
      });
      if (res.ok) {
        const entry = await res.json();
        setActiveEntry(entry);
      }
    },
    []
  );

  const stopTimer = useCallback(
    async (notes?: string) => {
      if (!activeEntry) return;
      const res = await fetch(`/api/admin/time-entries/${activeEntry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endTime: new Date().toISOString(),
          ...(notes !== undefined && { notes }),
        }),
      });
      if (res.ok) {
        setActiveEntry(null);
        setElapsedSeconds(0);
      }
    },
    [activeEntry]
  );

  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, []);

  return {
    activeEntry,
    elapsedSeconds,
    isRunning,
    startTimer,
    stopTimer,
    formatTime,
  };
}
