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

      const commitSnap = (dir: number) => {
        if (animating || dir === 0) return;

        const pos = positions();
        if (pos.length === 0) return;

        const y = lenis.scroll;
        const vh = window.innerHeight;
        const first = pos[0];
        const last = pos[pos.length - 1];
        // Only snap while within the projects band — leave the sections above and
        // below (Description, Freelance) scrolling normally.
        if (y < first - vh * 0.5 || y > last + vh * 0.5) {
          currentIndex = -1;
          return;
        }

        // Step by index rather than by scroll position: lenis.scroll lags the
        // input by a few px, which made "the next card up" resolve back to the
        // current card and hang. `currentIndex` is only trusted while we're still
        // near that card; otherwise (fresh entry, or a fling across cards) we
        // resync to the nearest card first.
        const near = nearestIndex(pos, y);
        const onCard = Math.abs(pos[near] - y) < 4;
        const fresh =
          currentIndex < 0 || Math.abs(pos[currentIndex] - y) > vh * 0.6;

        // At an end and heading further out (down past the last card, or up past
        // the first) — never re-grab the boundary card, just let the scroll flow
        // out to Freelance / Description. This is what was trapping you on the
        // last project: after exiting, the "fresh" branch kept snapping back.
        const lastIdx = pos.length - 1;
        if (
          (dir > 0 && near === lastIdx && y > pos[lastIdx] - 4) ||
          (dir < 0 && near === 0 && y < pos[0] + 4)
        ) {
          currentIndex = -1;
          return;
        }

        let targetIndex: number;
        if (fresh) {
          // Drifting in between cards → land on the nearest first; already on a
          // card → step off it in the gesture direction.
          targetIndex = onCard ? near + dir : near;
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
            // Small cooldown, and drop any residual momentum, so the tail of this
            // programmatic scroll can't be mistaken for a fresh gesture.
            window.setTimeout(() => {
              accumDelta = 0;
              animating = false;
              // Release the scroll lock this snap set. Card-to-card snaps override
              // it with the next scrollTo, but at the first/last card there is no
              // next snap — without this you get stuck, unable to scroll out to
              // Description/Freelance.
              (lenis as unknown as { isLocked: boolean }).isLocked = false;
            }, 80);
          },
        });
      };

      const flushGesture = () => {
        const dir = accumDelta > 0 ? 1 : accumDelta < 0 ? -1 : 0;
        accumDelta = 0;
        commitSnap(dir);
      };

      // virtual-scroll fires only for real wheel/touch input (never for our own
      // scrollTo), so it captures genuine user intent without self-triggering.
      const unsub = lenis.on("virtual-scroll", ({ deltaY }) => {
        if (animating || deltaY === 0) return;
        accumDelta += deltaY;
        if (settleTimer) {
          clearTimeout(settleTimer);
          settleTimer = null;
        }
        // Commit as soon as intent is clear (works while still scrolling), so a
        // continuous scroll up snaps card-by-card instead of blowing past.
        if (Math.abs(accumDelta) >= GESTURE_THRESHOLD) {
          flushGesture();
        } else {
          // Fallback for a very small, slow nudge that never reaches threshold.
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
