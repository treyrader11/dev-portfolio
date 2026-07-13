import { create } from "zustand";
import type { FqdProvider } from "../types/fqd-types";

interface FqdProviderState {
  provider: FqdProvider;
  setProvider: (provider: FqdProvider) => void;
}

// The AI model chosen at the top of the create-event page. Every AI action on
// that page reads this so they all use the selected model. Defaults to Gemini
// (free).
export const useFqdProvider = create<FqdProviderState>((set) => ({
  provider: "gemini",
  setProvider: (provider) => set({ provider }),
}));
