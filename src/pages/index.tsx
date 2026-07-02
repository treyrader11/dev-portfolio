"use client";

import { useRef, useEffect } from "react";
import type { NextPage, GetStaticProps } from "next";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import Inner from "@/components/layout/Inner";
import { cn } from "@/lib/utils";
import Description from "@/components/Description";
import SlidingImages from "@/components/SlidingImages";
import LatestWork from "@/components/LatestWork";
import Freelance from "@/components/Freelance";
import Hero from "@/components/Hero";
import PositionProvider from "@/components/providers/PositionProvider";
import {
  getLatestWorkProjects,
  getSliderProjects,
  type SliderProject,
} from "@/features/portfolio/lib/projects";
import type { ProjectData } from "@/types/data";
import type Lenis from "lenis";
// import References from "@/components/References";

const inter = Inter({ subsets: ["latin"] });

interface LocomotiveScrollInstance {
  destroy(): void;
  // Underlying Lenis instance Locomotive drives — used to attach snap.
  lenisInstance: Lenis | null;
  scrollTo(
    target: number | string | HTMLElement,
    options?: Record<string, unknown>,
  ): void;
}

interface HomeProps {
  latestWorkProjects: ProjectData[];
  sliderProjects: SliderProject[];
}

const Home: NextPage<HomeProps> = ({ latestWorkProjects, sliderProjects }) => {
  const container = useRef<HTMLDivElement>(null);
  const locomotiveScrollRef = useRef<LocomotiveScrollInstance | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    let cleanup: (() => void) | null = null;

    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const loco = new LocomotiveScroll() as LocomotiveScrollInstance;
      locomotiveScrollRef.current = loco;

      const lenis = loco.lenisInstance;
      if (!lenis) return;

      // Directional one-card-at-a-time snapping that rides Locomotive's own
      // smooth scroll. Nearest-point snapping pulls you back to the current card
      // on a small upward nudge; instead we read the direction of the user's
      // gesture and glide to the next card that way (down = next, up = previous).

      // Document-space top of a card. offsetTop is the static layout position, so
      // it is unaffected by the cards being sticky-pinned at the top.
      const docTop = (el: HTMLElement) => {
        let y = 0;
        let node: HTMLElement | null = el;
        while (node) {
          y += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        return y;
      };
      const positions = () =>
        Array.from(
          document.querySelectorAll<HTMLElement>("[data-snap-project]"),
        )
          .map(docTop)
          .sort((a, b) => a - b);

      const nearestIndex = (pos: number[], y: number) => {
        let best = 0;
        let bestDist = Infinity;
        pos.forEach((p, i) => {
          const d = Math.abs(p - y);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        return best;
      };

      // A gesture commits a snap once its accumulated delta crosses this many px.
      // Small, so "even a tiny scroll" locks to the next card — and because we
      // commit mid-gesture (not on settle) you can't fling straight through the
      // projects without snapping, in either direction.
      const GESTURE_THRESHOLD = 30;

      let accumDelta = 0; // summed wheel/touch delta for the current gesture
      let settleTimer: ReturnType<typeof setTimeout> | null = null;
      let animating = false;
      let currentIndex = -1; // card we're locked to; -1 = not engaged/unknown

      // isLocked (not isStopped) is what blocks scroll after a lock:true snap;
      // lenis.start() only clears isStopped, so we clear isLocked directly.
      const releaseLock = () => {
        (lenis as unknown as { isLocked: boolean }).isLocked = false;
      };

      const commitSnap = (dir: number) => {
        if (animating || dir === 0) return;

        const pos = positions();
        if (pos.length === 0) return;

        const y = lenis.scroll;
        const vh = window.innerHeight;
        const near = nearestIndex(pos, y);
        const lastIdx = pos.length - 1;

        // Exit cleanly at the boundaries FIRST, before any snap is attempted:
        // heading down past the last card, or up past the first, never re-grabs
        // the boundary card — the scroll flows out to Freelance / Description.
        if (dir > 0 && near === lastIdx && y >= pos[lastIdx] - 2) {
          currentIndex = -1;
          animating = false;
          releaseLock();
          return;
        }
        if (dir < 0 && near === 0 && y <= pos[0] + 2) {
          currentIndex = -1;
          animating = false;
          releaseLock();
          return;
        }

        // Outside the projects band entirely → leave scrolling alone.
        if (y < pos[0] - vh * 0.5 || y > pos[lastIdx] + vh * 0.5) {
          currentIndex = -1;
          return;
        }

        // Step by index rather than by scroll position: lenis.scroll lags the
        // input by a few px. currentIndex is only trusted while we're near it;
        // otherwise (fresh entry / a fling across cards) resync to the nearest.
        const onCard = Math.abs(pos[near] - y) < 4;
        const fresh =
          currentIndex < 0 || Math.abs(pos[currentIndex] - y) > vh * 0.6;

        let targetIndex: number;
        if (fresh) {
          if (dir < 0 && y > pos[lastIdx] - vh * 0.5) {
            // Re-entering from below (Freelance) heading up → land on the last
            // card first, so scroll-up snapping works from the bottom.
            targetIndex = lastIdx;
          } else {
            targetIndex = onCard ? near + dir : near;
          }
        } else {
          targetIndex = currentIndex + dir;
        }

        // Off either end → let the scroll continue out to Description/Freelance.
        if (targetIndex < 0 || targetIndex >= pos.length) {
          currentIndex = -1;
          return;
        }

        currentIndex = targetIndex;
        const target = pos[targetIndex];
        if (Math.abs(target - y) < 2) return; // already in place

        animating = true;
        lenis.scrollTo(target, {
          duration: 0.9,
          easing: (t) => 1 - Math.pow(1 - t, 3),
          lock: true,
          force: true,
          onComplete: () => {
            // Small cooldown, drop residual momentum, and release the lock this
            // snap set so the next gesture (or exiting at an end) isn't blocked.
            window.setTimeout(() => {
              accumDelta = 0;
              animating = false;
              releaseLock();
            }, 80);
          },
        });
      };

      const flushGesture = () => {
        const dir = accumDelta > 0 ? 1 : accumDelta < 0 ? -1 : 0;
        accumDelta = 0;
        commitSnap(dir);
      };

      // Drive the snap from Lenis's own `scroll` output rather than the raw
      // `virtual-scroll` input event. virtual-scroll doesn't fire for native
      // touch scrolling on mobile (Lenis doesn't smooth touch by default), so
      // listening to `scroll` (which reflects both wheel and touch) makes the
      // snap work on phones as well as desktop. Direction = sign of the delta.
      let lastScrollY = lenis.scroll;
      const unsub = lenis.on("scroll", (instance) => {
        const scroll = instance.scroll;
        const delta = scroll - lastScrollY;
        // Update every event, even mid-snap, so the first event after our own
        // programmatic scroll doesn't register the whole snap as a fresh gesture.
        lastScrollY = scroll;
        if (animating) return;
        if (Math.abs(delta) < 1) return;

        accumDelta += delta;
        if (settleTimer) {
          clearTimeout(settleTimer);
          settleTimer = null;
        }
        // Commit as soon as intent is clear (works while still scrolling), so a
        // continuous scroll snaps card-by-card instead of blowing past.
        if (Math.abs(accumDelta) >= GESTURE_THRESHOLD) {
          flushGesture();
        } else {
          settleTimer = setTimeout(flushGesture, 140);
        }
      });

      cleanup = () => {
        unsub();
        if (settleTimer) clearTimeout(settleTimer);
      };
    })();

    return () => {
      // Cleanup on unmount
      cleanup?.();
      if (locomotiveScrollRef.current) {
        locomotiveScrollRef.current.destroy();
      }
    };
  }, []);

  return (
    <main className={cn(inter.className, "overflow-clip")}>
      <Inner ref={container} backgroundColor="#934E00">
        <Hero className={cn("min-h-screen bg-dark")} />
        <Description className={cn("bg-white")} />
        <PositionProvider>
          <LatestWork
            className={cn("bg-white")}
            projects={latestWorkProjects}
          />
        </PositionProvider>

        <Freelance className={cn("bg-white")} />

        <div className={cn("relative px-6 sm:min-h-screen sm:px-20")}>
          {/* <References /> */}
          <SlidingImages className="bg-white" projects={sliderProjects} />
        </div>
      </Inner>
    </main>
  );
};

export default Home;

// Static generation + ISR: the home page ships as static HTML (SEO-friendly,
// no client-side data fetching) and revalidates so admin edits surface quickly.
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const [latestWorkProjects, sliderProjects] = await Promise.all([
    getLatestWorkProjects(),
    getSliderProjects(),
  ]);
  return {
    props: { latestWorkProjects, sliderProjects },
    revalidate: 60,
  };
};
