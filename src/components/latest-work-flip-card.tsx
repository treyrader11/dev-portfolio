// "use client";

// import { useContext, useEffect, useRef, useState } from "react";
// import { motion, useScroll, useMotionValueEvent } from "framer-motion";
// import { cn } from "@/lib/utils";
// import { PositionContext } from "@/lib/contexts";
// import LatestWorkCardFront from "./latest-work-card-front";
// import LatestWorkCardBack from "./latest-work-card-back";
// import type { ProjectData } from "@/types/data";
// import type { ScrollPosition } from "@/types/components";

// interface Props {
//   project: ProjectData;
//   className?: string;
//   // Optional: preserves the section's Scrollbar active-position tracking when
//   // rendered inside the Latest Work list.
//   position?: ScrollPosition;
// }

// // The single flippable project card dropped into any page. Front is a laptop
// // mockup of the screenshot; back is the "View" button. The sticky container,
// // scroll-position tracking, and flip timing/easing are preserved from the
// // original Latest Work card.
// export default function LatestWorkFlipCard({
//   project,
//   className,
//   position,
// }: Props) {
//   const container = useRef<HTMLDivElement>(null);

//   const positionContext = useContext(PositionContext);
//   const { setActivePosition, setActivePositionProgress } =
//     positionContext || {};

//   const [isFlipped, setIsFlipped] = useState(false);
//   const [isAnimating, setIsAnimating] = useState(false);

//   // True only when this card is pinned at the top of the viewport (i.e. snapped
//   // into position) and scrolling has settled — used to reveal the carousel
//   // controls only on the project that's locked in place.
//   const [snapped, setSnapped] = useState(false);
//   useEffect(() => {
//     let timer: ReturnType<typeof setTimeout>;
//     const check = () => {
//       const el = container.current;
//       if (!el) return;
//       const pinned = Math.abs(el.getBoundingClientRect().top) < 8;
//       // All earlier cards stay pinned at the top too, but are covered by the
//       // ones stacked over them. Only treat this card as snapped if the next
//       // project hasn't risen up to cover it — otherwise its controls would show
//       // (and bleed through the covering card's transparent frame margins).
//       let covered = false;
//       if (pinned) {
//         const all = Array.from(
//           document.querySelectorAll<HTMLElement>("[data-snap-project]"),
//         );
//         const next = all[all.indexOf(el) + 1];
//         if (
//           next &&
//           next.getBoundingClientRect().top < window.innerHeight * 0.5
//         ) {
//           covered = true;
//         }
//       }
//       setSnapped(pinned && !covered);
//     };
//     const onScroll = () => {
//       setSnapped(false); // hide controls while moving
//       clearTimeout(timer);
//       timer = setTimeout(check, 160); // re-check once the scroll settles
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     check();
//     return () => {
//       window.removeEventListener("scroll", onScroll);
//       clearTimeout(timer);
//     };
//   }, []);

//   const handleFlip = () => {
//     if (!isAnimating) {
//       setIsFlipped(!isFlipped);
//       setIsAnimating(true);
//     }
//   };

//   // Scrollbar/position tracking — unchanged from the original card.
//   const { scrollYProgress } = useScroll({
//     target: container,
//     offset: ["start center", "end center"],
//   });

//   useMotionValueEvent(scrollYProgress, "change", (value) => {
//     if (
//       value > 0 &&
//       value < 1 &&
//       setActivePosition &&
//       setActivePositionProgress
//     ) {
//       position?.positionId && setActivePosition(position.positionId);
//       setActivePositionProgress(value);
//     }
//   });

//   return (
//     <div
//       style={{ perspective: 1000 }}
//       ref={container}
//       // Snap target: the home page registers these with Lenis Snap so each card
//       // locks to the top of the viewport as you scroll.
//       data-snap-project
//       className={cn(
//         "z-10",
//         "w-full",
//         "flex",
//         "flex-col",
//         "items-center",
//         "justify-center",
//         "min-h-dvh",
//         "snap-start",
//         "sticky",
//         "top-0",
//         "cursor-pointer",
//         className,
//       )}
//       onClick={handleFlip}
//     >
//       {/* Front of card */}
//       <motion.div
//         initial={false}
//         animate={{ rotateY: isFlipped ? 180 : 360 }}
//         transition={{ duration: 0.6 }}
//         onAnimationComplete={() => setIsAnimating(false)}
//         style={{ transition: "transform 0.6s", backfaceVisibility: "hidden" }}
//         className={cn(
//           "h-dvh",
//           // absolute (not fixed): the faces still fill the sticky, 100vh card,
//           // but avoid iOS Safari's broken rendering of fixed elements nested in
//           // a `perspective` ancestor (which hid the laptop/shots on iPhone).
//           "absolute",
//           "top-0",
//           "w-[120%]",
//           "-left-[calc(20%_-_10%)]",
//           "flex",
//           "items-center",
//           "justify-center",
//         )}
//       >
//         {/* Mobile: as large as possible, capped by both viewport dimensions so
//             the square frame never overflows. Desktop keeps its smaller size. */}
//         <div className="w-[min(94vw,90vh)] sm:w-[62%] max-w-[900px]">
//           <LatestWorkCardFront project={project} showControls={snapped} />
//         </div>
//       </motion.div>

//       {/* Back of card */}
//       <motion.div
//         initial={false}
//         animate={{ rotateY: isFlipped ? 360 : 180 }}
//         transition={{ duration: 0.6 }}
//         onAnimationComplete={() => setIsAnimating(false)}
//         style={{ transition: "transform 0.6s", backfaceVisibility: "hidden" }}
//         onClick={handleFlip}
//         className={cn(
//           "h-dvh",
//           // absolute (not fixed): the faces still fill the sticky, 100vh card,
//           // but avoid iOS Safari's broken rendering of fixed elements nested in
//           // a `perspective` ancestor (which hid the laptop/shots on iPhone).
//           "absolute",
//           "top-0",
//           "w-[120%]",
//           "-left-[calc(20%_-_10%)]",
//           "flex",
//           "items-center",
//           "justify-center",
//         )}
//       >
//         {/* Same sized wrapper as the front so the mockup overlaps exactly. */}
//         <div className="relative w-[min(94vw,90vh)] sm:w-[62%] max-w-[900px]">
//           <LatestWorkCardBack project={project} />
//         </div>
//       </motion.div>
//     </div>
//   );
// }

"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { PositionContext } from "@/lib/contexts";
import LatestWorkCardFront from "./latest-work-card-front";
import LatestWorkCardBack from "./latest-work-card-back";
import MaskedRevealText from "./masked-reveal-text";
import type { ProjectData } from "@/types/data";
import type { ScrollPosition } from "@/types/components";

interface Props {
  project: ProjectData;
  className?: string;
  position?: ScrollPosition;
}

export default function LatestWorkFlipCard({
  project,
  className,
  position,
}: Props) {
  const container = useRef<HTMLDivElement>(null);

  const positionContext = useContext(PositionContext);
  const { setActivePosition, setActivePositionProgress } =
    positionContext || {};

  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [snapped, setSnapped] = useState(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const check = () => {
      const el = container.current;
      if (!el) return;
      const pinned = Math.abs(el.getBoundingClientRect().top) < 8;
      let covered = false;
      if (pinned) {
        const all = Array.from(
          document.querySelectorAll<HTMLElement>("[data-snap-project]"),
        );
        const next = all[all.indexOf(el) + 1];
        if (
          next &&
          next.getBoundingClientRect().top < window.innerHeight * 0.5
        ) {
          covered = true;
        }
      }
      setSnapped(pinned && !covered);
    };
    const onScroll = () => {
      setSnapped(false);
      clearTimeout(timer);
      timer = setTimeout(check, 160);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    check();
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleFlip = () => {
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  };

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start center", "end center"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (
      value > 0 &&
      value < 1 &&
      setActivePosition &&
      setActivePositionProgress
    ) {
      position?.positionId && setActivePosition(position.positionId);
      setActivePositionProgress(value);
    }
  });

  // Card size class — same on front and back so they overlap exactly.
  const cardSize = "w-[min(94vw,90vh)] sm:w-[62%] max-w-[900px]";

  return (
    // Outer container: sticky scroll anchor + perspective. NO onClick here —
    // clicking the transparent white area outside the laptop should do nothing.
    <div
      style={{ perspective: 1000 }}
      ref={container}
      data-snap-project
      className={cn(
        "z-10",
        "w-full",
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "min-h-dvh",
        "sticky",
        "top-0",
        className,
      )}
    >
      {/* Front of card */}
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 360 }}
        transition={{ duration: 0.6 }}
        onAnimationComplete={() => setIsAnimating(false)}
        style={{ transition: "transform 0.6s", backfaceVisibility: "hidden" }}
        className={cn(
          "h-dvh",
          "absolute",
          "top-0",
          "w-[120%]",
          "-left-[calc(20%_-_10%)]",
          "flex",
          "items-center",
          "justify-center",
          // Only the card itself is clickable — not the surrounding transparent area.
          "pointer-events-none",
        )}
      >
        {/* onClick lives here so only the laptop frame area triggers the flip */}
        <div
          className={cn(cardSize, "cursor-pointer pointer-events-auto")}
          onClick={handleFlip}
        >
          <LatestWorkCardFront project={project} showControls={snapped} />
        </div>
      </motion.div>

      {/* Back of card */}
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 360 : 180 }}
        transition={{ duration: 0.6 }}
        onAnimationComplete={() => setIsAnimating(false)}
        style={{ transition: "transform 0.6s", backfaceVisibility: "hidden" }}
        className={cn(
          "h-dvh",
          "absolute",
          "top-0",
          "w-[120%]",
          "-left-[calc(20%_-_10%)]",
          "flex",
          "items-center",
          "justify-center",
          "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "relative",
            cardSize,
            "cursor-pointer pointer-events-auto",
          )}
          onClick={handleFlip}
        >
          <LatestWorkCardBack project={project} />
        </div>
      </motion.div>

      {/* Caption below the card — the masked text-reveal from the Evolve demos
          page. It plays IN when this card snaps into place and OUT (masking up)
          when it snaps away, keyed off the same `snapped` signal as the
          carousel controls. */}
      <MaskedRevealText
        show={snapped}
        className={cn(
          "pointer-events-none",
          "absolute",
          "inset-x-0",
          // Sit a bit higher on mobile so the caption clears the bottom edge /
          // browser chrome; back to the tighter offset on larger screens.
          "bottom-[14vh]",
          "sm:bottom-[6vh]",
          "z-20",
          // Block layout (NOT flex): each line's overflow-hidden mask box needs
          // to be full width so the text isn't clipped to a narrow column — the
          // mask only clips vertically. Lines center via text-center.
          "space-y-1",
          "px-6",
          "text-center",
        )}
        lines={[
          {
            text: project.title,
            className: cn(
              "font-pp-acma",
              "font-bold",
              "uppercase",
              "tracking-wide",
              "leading-none",
              "text-dark",
              "text-3xl sm:text-5xl",
            ),
          },
          ...(project.category
            ? [
                {
                  text: project.category,
                  className: cn(
                    "font-pp-acma",
                    "uppercase",
                    "tracking-[0.25em]",
                    "text-secondary",
                    "text-xs sm:text-sm",
                  ),
                },
              ]
            : []),
        ]}
      />
    </div>
  );
}
