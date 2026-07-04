"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// The cursor-following project modal from the awwwards portfolio original: a
// white card (showing the hovered project's poster), a colored cursor dot, and
// a "View" label — all trailing the cursor via gsap.quickTo with slightly
// different durations so they lag apart nicely. `enabled` gates the whole thing
// to devices with a real pointer, so it's never set up on touch screens.
export function useCursorModal(enabled: boolean) {
  const modalContainer = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const cursorLabel = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState({ active: false, index: 0 });

  // [containerX, containerY, cursorX, cursorY, labelX, labelY]
  const move = useRef<gsap.QuickToFunc[]>([]);
  useEffect(() => {
    if (!enabled) return;
    const to = (
      el: HTMLDivElement | null,
      prop: "left" | "top",
      duration: number,
    ) => gsap.quickTo(el, prop, { duration, ease: "power3" });
    move.current = [
      to(modalContainer.current, "left", 0.8),
      to(modalContainer.current, "top", 0.8),
      to(cursor.current, "left", 0.5),
      to(cursor.current, "top", 0.5),
      to(cursorLabel.current, "left", 0.45),
      to(cursorLabel.current, "top", 0.45),
    ];
  }, [enabled]);

  const moveItems = (x: number, y: number) => {
    const m = move.current;
    m[0]?.(x);
    m[1]?.(y);
    m[2]?.(x);
    m[3]?.(y);
    m[4]?.(x);
    m[5]?.(y);
  };

  const manageModal = (
    active: boolean,
    index: number,
    x: number,
    y: number,
  ) => {
    moveItems(x, y);
    setModal({ active, index });
  };

  return { modalContainer, cursor, cursorLabel, modal, moveItems, manageModal };
}
