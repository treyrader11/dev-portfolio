import { create } from "zustand";
import type { FqdProvider } from "../types/fqd-types";

interface FqdProviderState {
  provider: FqdProvider;
  // Whether the user changed it this session (a manual pick beats the default).
  userSet: boolean;
  setProvider: (provider: FqdProvider) => void;
  // Apply the admin-configured default (only if the user hasn't picked one).
  applyDefault: (provider: FqdProvider) => void;
}

// The AI model used by every AI action on the create-event page. Initializes to
// the admin default (from settings) and can be overridden per-session with the
// top-of-page selector.
export const useFqdProvider = create<FqdProviderState>((set, get) => ({
  provider: "gemini",
  userSet: false,
  setProvider: (provider) => set({ provider, userSet: true }),
  applyDefault: (provider) => {
    if (!get().userSet) set({ provider });
  },
}));
