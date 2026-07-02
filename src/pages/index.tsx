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
import { getLatestWorkProjects } from "@/features/portfolio/lib/projects";
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
}

const Home: NextPage<HomeProps> = ({ latestWorkProjects }) => {
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

      let accumDelta = 0; // summed wheel/touch delta for the current gesture
      let settleTimer: ReturnType<typeof setTimeout> | null = null;
      let animating = false;

      const snapInDirection = () => {
        const delta = accumDelta;
        accumDelta = 0;
        if (animating) return;
        // Direction from the gesture's net delta, not its last event — trackpads
        // emit a tiny opposite-sign delta at the end of a flick, which would
        // otherwise flip a small scroll-up into a snap back down.
        const dir = delta > 0 ? 1 : delta < 0 ? -1 : 0;
        if (dir === 0) return;

        const pos = positions();
        if (pos.length === 0) return;

        const y = lenis.scroll;
        const vh = window.innerHeight;
        const first = pos[0];
        const last = pos[pos.length - 1];
        // Only snap while within the projects band — leave the sections above and
        // below (Description, Freelance) scrolling normally.
        if (y < first - vh * 0.5 || y > last + vh * 0.5) return;

        const target =
          dir > 0
            ? pos.find((p) => p > y + 4) // next card down
            : [...pos].reverse().find((p) => p < y - 4); // previous card up
        // No card that way (first/last) → let the scroll continue out of section.
        if (target === undefined || Math.abs(target - y) < 4) return;

        animating = true;
        lenis.scrollTo(target, {
          duration: 0.9,
          easing: (t) => 1 - Math.pow(1 - t, 3),
          lock: true,
          force: true,
          onComplete: () => {
            // Small cooldown so the tail of this programmatic scroll can't be
            // mistaken for a fresh gesture.
            window.setTimeout(() => {
              animating = false;
            }, 80);
          },
        });
      };

      // virtual-scroll fires only for real wheel/touch input (never for our own
      // scrollTo), so it captures genuine user intent without self-triggering.
      const unsub = lenis.on("virtual-scroll", ({ deltaY }) => {
        if (animating || deltaY === 0) return;
        accumDelta += deltaY;
        if (settleTimer) clearTimeout(settleTimer);
        settleTimer = setTimeout(snapInDirection, 140);
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
          <SlidingImages className="bg-white" />
        </div>
      </Inner>
    </main>
  );
};

export default Home;

// Static generation + ISR: the home page ships as static HTML (SEO-friendly,
// no client-side data fetching) and revalidates so admin edits surface quickly.
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const latestWorkProjects = await getLatestWorkProjects();
  return {
    props: { latestWorkProjects },
    revalidate: 60,
  };
};
