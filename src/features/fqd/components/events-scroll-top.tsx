"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RiArrowUpLine } from "react-icons/ri";
import { scrollToTop } from "@/lib/smooth-scroll";

// A floating "back to top" button for the admin events page — mirrors the public
// ScrollTopFAB: slides in from the right once a viewport has scrolled, and
// smooth-scrolls to the top on click.
export function EventsScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Back to top"
          title="Back to top"
          onClick={scrollToTop}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed bottom-7 right-7 z-40 flex size-12 items-center justify-center rounded-2xl border border-dark-600 bg-dark-500/70 text-secondary backdrop-blur-md transition-colors hover:border-secondary/60 hover:text-white"
        >
          <RiArrowUpLine className="size-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
