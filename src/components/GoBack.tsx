"use client";

import { useRef } from "react";
import { useRouter } from "next/router";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { RiArrowLeftLine } from "react-icons/ri";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import { cn } from "@/lib/utils";
import { skipNextPageTransition } from "@/lib/page-transition";

interface Props {
  className?: string;
}

// A reusable "back to the previous page" button. Skips the page transition
// animation so returning feels instant. Rendered on every non-root, non-admin
// page (wired up in the public Layout). Like the burger menu, it scales in once
// the header scrolls out of view and scales back out when it returns.
export default function GoBack({ className }: Props) {
  const router = useRouter();
  const button = useRef<HTMLButtonElement>(null);

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!button.current) return;

    // gsap owns the transform (start hidden).
    gsap.set(button.current, { scale: 0 });

    // Reveal the moment the header scrolls out of view (past its height); hide
    // again when scrolling back up to it. Same 0.25s power1.out as the burger.
    const header = document.querySelector("header");
    const end = header?.offsetHeight || 120;

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end,
      onLeave: () =>
        gsap.to(button.current, { scale: 1, duration: 0.25, ease: "power1.out" }),
      onEnterBack: () =>
        gsap.to(button.current, { scale: 0, duration: 0.25, ease: "power1.out" }),
    });

    return () => trigger.kill();
  }, []);

  return (
    <button
      ref={button}
      type="button"
      aria-label="Go back to the previous page"
      onClick={() => {
        skipNextPageTransition();
        router.back();
      }}
      className={cn(
        "fixed left-4 top-24 z-40 flex items-center gap-1.5 rounded-full",
        "border border-black/10 bg-white/80 px-4 py-2 text-sm font-medium text-dark",
        "shadow-sm backdrop-blur transition-colors hover:bg-white sm:left-6",
        className,
      )}
    >
      <RiArrowLeftLine className="size-4" />
      Back
    </button>
  );
}
