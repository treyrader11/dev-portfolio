import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { RiArrowUpLine } from "react-icons/ri";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import { scrollToTop } from "@/lib/smooth-scroll";

// Same routes the AdminFAB hides on, so the pair stays consistent.
const HIDDEN_ROUTES = ["/admin", "/contact"];

// A floating "scroll to top" button mirrored to the bottom-right, horizontally
// aligned with the AdminFAB (bottom: 28). It scales in exactly like the burger
// menu — same scroll position (one viewport of scroll), easing, and scale — and
// scrolls fast to the top on click.
export default function ScrollTopFAB() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const portalRef = useRef<HTMLElement | null>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    portalRef.current = document.getElementById("fab-portal");
    setMounted(true);
  }, []);

  const shouldHide = HIDDEN_ROUTES.some((r) => router.pathname.startsWith(r));

  // Reveal on scroll, identical to the burger: hidden (scale 0) until a full
  // viewport has scrolled, then springs to scale 1; reverses on the way back up.
  useIsomorphicLayoutEffect(() => {
    if (shouldHide || !button.current) return;
    gsap.registerPlugin(ScrollTrigger);

    // gsap owns the transform (not React) so hover re-renders can't reset the
    // scroll-driven scale. Start hidden.
    gsap.set(button.current, { scale: 0 });

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: window.innerHeight,
      onLeave: () =>
        gsap.to(button.current, {
          scale: 1,
          duration: 0.25,
          ease: "power1.out",
        }),
      onEnterBack: () =>
        gsap.to(button.current, {
          scale: 0,
          duration: 0.25,
          ease: "power1.out",
        }),
    });

    return () => trigger.kill();
  }, [shouldHide, mounted]);

  if (shouldHide || !mounted || !portalRef.current) return null;

  return createPortal(
    <button
      ref={button}
      type="button"
      aria-label="Back to top"
      onClick={scrollToTop}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "auto",
        bottom: 28,
        right: 28,
        width: 52,
        height: 52,
        borderRadius: 14,
        color: "#c084fc",
        background: "rgba(255,255,255,0.04)",
        border: hovered
          ? "1px solid rgba(192,132,252,0.4)"
          : "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: hovered ? "0 0 20px rgba(192,132,252,0.15)" : "none",
        cursor: "pointer",
      }}
    >
      <RiArrowUpLine size={22} />
    </button>,
    portalRef.current,
  );
}
