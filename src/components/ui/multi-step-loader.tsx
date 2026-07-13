"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={cn("h-6 w-6", className)}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const CheckFilled = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn("h-6 w-6", className)}
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
      clipRule="evenodd"
    />
  </svg>
);

export type LoadingState = { text: string };
export type StepStatus = "pending" | "active" | "done";
export type LoadingStep = { text: string; status: StepStatus };

// Auto-advancing / value-driven checklist (the generic looping loader).
function LoaderCore({
  loadingStates,
  value = 0,
}: {
  loadingStates: LoadingState[];
  value?: number;
}) {
  return (
    <div className="relative mx-auto mt-40 flex max-w-xl flex-col justify-start">
      {loadingStates.map((state, index) => {
        const distance = Math.abs(index - value);
        const opacity = Math.max(1 - distance * 0.2, 0);
        const active = value === index;
        const done = index < value;
        return (
          <motion.div
            key={index}
            className="mb-4 flex gap-2 text-left"
            initial={{ opacity: 0, y: -(value * 40) }}
            animate={{ opacity, y: -(value * 40) }}
            transition={{ duration: 0.5 }}
          >
            <div>
              {index > value ? (
                <CheckIcon className="text-light-400" />
              ) : (
                <CheckFilled
                  className={cn(
                    done ? "text-white" : "text-light-400",
                    active && "text-lime-400",
                  )}
                />
              )}
            </div>
            <span className={cn("text-white", active && "font-medium text-lime-400")}>
              {state.text}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

// Status-driven checklist: each step carries its own pending/active/done state,
// so several can be in progress at once and the copy reflects real work.
function StatusLoaderCore({ steps }: { steps: LoadingStep[] }) {
  const firstActive = steps.findIndex((s) => s.status === "active");
  const doneCount = steps.filter((s) => s.status === "done").length;
  const focus =
    firstActive >= 0
      ? firstActive
      : Math.min(doneCount, Math.max(0, steps.length - 1));

  return (
    <div className="relative mx-auto mt-40 flex max-w-xl flex-col justify-start">
      {steps.map((s, index) => {
        const distance = Math.abs(index - focus);
        const opacity = Math.max(1 - distance * 0.2, 0);
        return (
          <motion.div
            key={index}
            className="mb-4 flex items-start gap-2 text-left"
            initial={{ opacity: 0, y: -(focus * 40) }}
            animate={{ opacity, y: -(focus * 40) }}
            transition={{ duration: 0.5 }}
          >
            <div className="shrink-0">
              {s.status === "pending" ? (
                <CheckIcon className="text-light-400" />
              ) : (
                <CheckFilled
                  className={cn(
                    s.status === "done"
                      ? "text-white"
                      : "text-lime-400 animate-pulse",
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                s.status === "done" && "text-white",
                s.status === "active" && "font-medium text-lime-400",
                s.status === "pending" && "text-light-400",
              )}
            >
              {s.text}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

// Full-screen, multi-step animated loading overlay.
// - Pass `steps` (with per-step status) for a live, real-progress checklist.
// - Or pass `loadingStates` (+ optional `value`) for a value-driven / looping one.
export function MultiStepLoader({
  loadingStates,
  steps,
  loading,
  value,
  duration = 2000,
  loop = true,
}: {
  loadingStates?: LoadingState[];
  steps?: LoadingStep[];
  loading?: boolean;
  value?: number;
  duration?: number;
  loop?: boolean;
}) {
  const controlled = value !== undefined || steps !== undefined;
  const [currentState, setCurrentState] = useState(0);
  const count = loadingStates?.length ?? 0;

  useEffect(() => {
    if (controlled) return;
    if (!loading) {
      setCurrentState(0);
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentState((prev) =>
        loop ? (prev === count - 1 ? 0 : prev + 1) : Math.min(prev + 1, count - 1),
      );
    }, duration);
    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, count, duration, controlled]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex h-full w-full items-center justify-center backdrop-blur-2xl"
        >
          <div className="relative h-96">
            {steps ? (
              <StatusLoaderCore steps={steps} />
            ) : (
              <LoaderCore
                value={value ?? currentState}
                loadingStates={loadingStates ?? []}
              />
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 z-20 h-full bg-dark [mask-image:radial-gradient(900px_at_center,transparent_30%,black)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
