import { useSyncExternalStore } from "react";

// Tiny external store for "skip the page transition on the next navigation".
// Call skipNextPageTransition() right before a router navigation you want to be
// instant (e.g. opening a repo detail page or a Go Back click); the <Inner>
// wrapper reads the flag and renders without the slide/perspective animation.
// The flag is cleared once the route settles (see _app's routeChangeComplete).

let skip = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function skipNextPageTransition(): void {
  if (skip) return;
  skip = true;
  emit();
}

export function clearPageTransitionSkip(): void {
  if (!skip) return;
  skip = false;
  emit();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// Reactive read; server snapshot is always false (no skipping during SSR).
export function usePageTransitionSkip(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => skip,
    () => false,
  );
}
