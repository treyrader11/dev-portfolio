// Locks page scrolling for the duration of a touch drag. On mobile, a card's
// `touch-action` lets the browser turn a finger drag into a page scroll (which
// also cancels the pointer gesture, so the item never moves). While a drag is
// active we (1) preventDefault every touchmove with a NON-passive listener — the
// only reliable cross-browser way to stop scroll mid-gesture — and (2) pin
// `body` overflow as a belt-and-suspenders. Idempotent: safe to call the
// lock/unlock pair from several handlers (pointerup, pointercancel, dragend).

let locked = false;
let touchMoveHandler: ((e: TouchEvent) => void) | null = null;
let previousOverflow = "";

export function lockScroll(): void {
  if (locked || typeof document === "undefined") return;
  locked = true;
  touchMoveHandler = (e: TouchEvent) => e.preventDefault();
  // passive:false is required so preventDefault actually blocks the scroll.
  document.addEventListener("touchmove", touchMoveHandler, { passive: false });
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
}

export function unlockScroll(): void {
  if (!locked || typeof document === "undefined") return;
  locked = false;
  if (touchMoveHandler) {
    document.removeEventListener("touchmove", touchMoveHandler);
    touchMoveHandler = null;
  }
  document.body.style.overflow = previousOverflow;
}
