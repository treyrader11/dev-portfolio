import { createContext, useCallback, useContext, useState } from "react";

// The focus-expand UX: at most one field is "focused" at a time. Focusing a
// field lifts it above a blurred backdrop while every other field dims, so the
// active input reads sharply. Fields identify themselves by a stable id.
export interface FocusExpand {
  focusedId: string | null;
  setFocusedId: (id: string | null) => void;
  // Spread onto any input/textarea to register it with the focus system.
  getFocusProps: (id: string) => { onFocus: () => void; onBlur: () => void };
  isFocused: (id: string) => boolean;
  // True when a *different* field is focused (this one should dim/blur).
  isDimmed: (id: string) => boolean;
}

export function useFocusExpand(): FocusExpand {
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const getFocusProps = useCallback(
    (id: string) => ({
      onFocus: () => setFocusedId(id),
      // Only clear if we're still the focused field — guards against a race
      // where another field's focus lands before our blur fires.
      onBlur: () => setFocusedId((cur) => (cur === id ? null : cur)),
    }),
    [],
  );

  const isFocused = useCallback((id: string) => focusedId === id, [focusedId]);
  const isDimmed = useCallback(
    (id: string) => focusedId !== null && focusedId !== id,
    [focusedId],
  );

  return { focusedId, setFocusedId, getFocusProps, isFocused, isDimmed };
}

// Shared so field components can auto-wire themselves to the page's focus state
// without every page threading props down. Provided by <AdminForm>.
const FocusExpandContext = createContext<FocusExpand | null>(null);
export const FocusExpandProvider = FocusExpandContext.Provider;

export function useFocusExpandContext(): FocusExpand | null {
  return useContext(FocusExpandContext);
}
