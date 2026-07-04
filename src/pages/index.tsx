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
import {
  getUserData,
  resolveAvatarUrl,
} from "@/features/profile/lib/get-user-data";
import SocialMeta from "@/components/SocialMeta";
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
  avatarUrl: string;
}

const Home: NextPage<HomeProps> = ({
  latestWorkProjects,
  sliderProjects,
  avatarUrl,
}) => {
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

      // Positions come from the non-sticky [data-snap-anchor] markers before each
      // card. Measuring the sticky cards directly is wrong: once pinned they all
      // report the same top:0 position, so "nearest card" resolved to 0 and the
      // snap yanked back to the first card while you were on the last. Anchors
      // stay in normal flow, so rect.top + scroll is always the card's true top.
      // Each anchor is an h-0 flex child, so the card actually starts one flex
      // row-gap below it — add that gap so the snap lands the card flush at the
      // top (otherwise it stops ~a gap short, which also hid the carousel
      // controls, since they only show when the card is pinned within 8px).
      const positions = () => {
        const anchors = Array.from(
          document.querySelectorAll<HTMLElement>("[data-snap-anchor]"),
        );
        if (anchors.length === 0) return [];
        const parent = anchors[0].parentElement;
        const gap = parent
          ? parseFloat(getComputedStyle(parent).rowGap) || 0
          : 0;
        return anchors
          .map((el) => el.getBoundingClientRect().top + lenis.scroll + gap)
          .sort((a, b) => a - b);
      };

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

      const GESTURE_THRESHOLD = 30;
      let accumDelta = 0;
      let settleTimer: ReturnType<typeof setTimeout> | null = null;
      let animating = false;
      let currentIndex = -1;
      // Latched once we release past the last card. While set, the whole
      // last-card→footer region is free scroll and snapping stays disarmed until
      // you scroll well back up into the cards — so crossing the last card
      // boundary can't yank the page up and down.
      let exitedBottom = false;

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

        // Exit at the ends — don't re-grab the first/last card when heading out,
        // so the scroll flows on to Description / Freelance.
        if (dir > 0 && near === lastIdx && y >= pos[lastIdx] - 2) {
          exitedBottom = true;
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

        // Once we've released past the last card, keep snapping disarmed through
        // the entire last-card→footer region and only re-arm after scrolling back
        // up at least half a viewport into the cards. This stops the boundary
        // oscillation (yank up, scroll down, yank up…) that read as glitching.
        if (exitedBottom) {
          if (y < pos[lastIdx] - vh * 0.5) {
            exitedBottom = false;
          } else {
            currentIndex = -1;
            return;
          }
        }

        // Outside the projects band → leave scrolling alone. The lower bound is
        // pinned just past the last card (not half a viewport below it) so the
        // whole region between the last card and the footer curve is free scroll.
        if (y < pos[0] - vh * 0.5 || y > pos[lastIdx] + 2) {
          currentIndex = -1;
          return;
        }

        // Step by index; currentIndex is trusted while we're near it, otherwise
        // (fresh entry / a fling) resync to the nearest card.
        const onCard = Math.abs(pos[near] - y) < 4;
        const fresh =
          currentIndex < 0 || Math.abs(pos[currentIndex] - y) > vh * 0.6;
        const targetIndex = fresh
          ? onCard
            ? near + dir
            : near
          : currentIndex + dir;

        // Off either end → let the scroll continue out.
        if (targetIndex < 0 || targetIndex >= pos.length) {
          currentIndex = -1;
          return;
        }

        currentIndex = targetIndex;
        const target = pos[targetIndex];
        if (Math.abs(target - y) < 2) return; // already in place

        animating = true;
        let released = false;
        const release = () => {
          if (released) return;
          released = true;
          accumDelta = 0;
          animating = false;
          releaseLock();
        };
        // Fallback release in case onComplete never fires, so a stuck lock can
        // never freeze scrolling.
        const guard = window.setTimeout(release, 1300);
        lenis.scrollTo(target, {
          duration: 0.9,
          easing: (t) => 1 - Math.pow(1 - t, 3),
          lock: true,
          force: true,
          onComplete: () => {
            window.clearTimeout(guard);
            window.setTimeout(release, 80);
          },
        });
      };

      const flushGesture = () => {
        const dir = accumDelta > 0 ? 1 : accumDelta < 0 ? -1 : 0;
        accumDelta = 0;
        commitSnap(dir);
      };

      // Drive from Lenis's `scroll` output (fires for wheel and native touch, so
      // it works on mobile too). Direction = sign of the scroll-position delta.
      let lastScrollY = lenis.scroll;
      const unsub = lenis.on("scroll", (instance) => {
        const scroll = instance.scroll;
        const delta = scroll - lastScrollY;
        lastScrollY = scroll; // update always, even mid-snap
        if (animating) return;
        if (Math.abs(delta) < 1) return;

        accumDelta += delta;
        if (settleTimer) {
          clearTimeout(settleTimer);
          settleTimer = null;
        }
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
      cleanup?.();
      if (locomotiveScrollRef.current) {
        locomotiveScrollRef.current.destroy();
      }
    };
  }, []);

  return (
    <main className={cn(inter.className, "overflow-clip")}>
      {/* Home share card uses the CMS avatar (overrides the _app default). */}
      <SocialMeta
        title="Trey Rader's Portfolio"
        description="Senior mobile architect specializing in React Native. Transforming complex challenges into elegant, performant solutions."
        image={avatarUrl}
        card="summary"
        path="/"
      />
      <Inner ref={container} backgroundColor="#934E00">
        <Hero className={cn("min-h-dvh bg-dark")} />
        <Description className={cn("bg-white")} />
        <PositionProvider>
          <LatestWork
            className={cn("bg-white")}
            projects={latestWorkProjects}
          />
        </PositionProvider>

        <Freelance className={cn("bg-white")} />

        <div className={cn("relative px-6 sm:px-20")}>
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
  const [latestWorkProjects, sliderProjects, user] = await Promise.all([
    getLatestWorkProjects(),
    getSliderProjects(),
    getUserData(),
  ]);
  return {
    props: {
      latestWorkProjects,
      sliderProjects,
      avatarUrl: resolveAvatarUrl(user),
    },
    revalidate: 60,
  };
};
