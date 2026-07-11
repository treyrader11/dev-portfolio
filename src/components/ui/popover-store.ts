import { create } from "zustand";

// Tracks which popover (by id) is currently open, so only one is open at a time
// across the app. Reused by every <Popover />.
interface PopoverState {
  openId: string | null;
  open: (id: string) => void;
  close: () => void;
  toggle: (id: string) => void;
}

export const usePopoverStore = create<PopoverState>((set) => ({
  openId: null,
  open: (id) => set({ openId: id }),
  close: () => set({ openId: null }),
  toggle: (id) => set((s) => ({ openId: s.openId === id ? null : id })),
}));
