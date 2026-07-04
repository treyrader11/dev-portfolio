import type Lenis from "lenis";

// The home page drives scrolling through Locomotive/Lenis; other pages use the
// native scroll. We stash the active Lenis instance here (set by the home page)
// so anything — like the scroll-to-top FAB — can scroll to the top correctly on
// every page without threading the instance through the tree.
let lenisInstance: Lenis | null = null;

// True while a programmatic scroll-to-top is running. The home page's Latest
// Work snap logic reads this and stands down, so it doesn't re-grab a card and
// halt the ascent as the scroll passes back through the stacked cards.
let snapSuppressed = false;

export function setLenis(instance: Lenis | null): void {
  lenisInstance = instance;
}

export function isSnapSuppressed(): boolean {
  return snapSuppressed;
}

// Fast smooth scroll back to the top. Uses Lenis when it's driving the page
// (so it doesn't fight the smooth-scroll layer), otherwise native smooth scroll.
export function scrollToTop(): void {
  if (lenisInstance) {
    snapSuppressed = true;
    lenisInstance.scrollTo(0, {
      duration: 0.8,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      lock: true,
      force: true,
      onComplete: () => {
        snapSuppressed = false;
      },
    });
    // Safety net: clear the flag even if onComplete never fires, so snapping
    // can never get stuck disabled.
    window.setTimeout(() => {
      snapSuppressed = false;
    }, 1500);
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}
