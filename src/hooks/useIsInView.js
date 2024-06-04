"use client";

import { useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

export function useIsInView(container, el, yPos) {
  const [isInView, setIsInView] = useState(false);

  gsap.to(el, { scale: 0, duration: 0.25, ease: "power1.out" });

  //   useLayoutEffect(() => {
  //     gsap.registerPlugin(ScrollTrigger);
  //     ScrollTrigger.create({
  //       trigger: container.current,
  //       start: yPos,
  //       end: window.innerHeight,
  //       onLeave: () => {
  //         // setIsInView(true);
  //         gsap.to(el, {
  //           scale: 1,
  //           duration: 0.25,
  //           ease: "power1.out",
  //         });
  //       },
  //       onEnterBack: () => {

  //         gsap.to(el, {
  //           scale: 0,
  //           duration: 0.25,
  //           ease: "power1.out",
  //         });
  //         setIsInView(false);
  //       },
  //     });

  //     return () => {
  //       ScrollTrigger.refresh();
  //     };
  //   }, [container, el, yPos]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(el, {
      scrollTrigger: {
        trigger: container,
        start: yPos,
        // start: 0,
        end: window.innerHeight,
        onLeave: () => {
          gsap.to(el, {
            scale: 1,
            duration: 0.25,
            ease: "power1.out",
          });
        },
        onEnterBack: () => {
          gsap.to(
            el,
            { scale: 0, duration: 0.25, ease: "power1.out" },
            setIsInView(false)
          );
        },
      },
    });
  }, [container, el, yPos]);

  return isInView;
}
