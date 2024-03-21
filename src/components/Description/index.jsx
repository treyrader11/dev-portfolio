"use client";

import { useInView, motion } from "framer-motion";
import { slideUp, opacity } from "./anim";
import Rounded from "@/common/Rounded";
import styles from "./styles";
import { cn } from "@/lib/utils";
import { useLayoutEffect, useRef } from "react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import gsap from "gsap";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";

export default function Description() {
  const phrase =
    "Helping brands to stand out in the digital era. Together we will set the new status quo. No nonsense, always on the cutting edge.";
  const description = useRef(null);
  const isInView = useInView(description);

  return (
    <section ref={description} className={cn(styles.description)}>
      <div className={cn(styles.container, "max-w-[1400px]")}>
        <p
          className={cn(styles.p, "text-[36px]", "gap-[8px]", "leading-[1.3]")}
        >
          {phrase.split(" ").map((word, index) => {
            return (
              <span key={index} className={styles.mask}>
                <motion.span
                  variants={slideUp}
                  custom={index}
                  animate={isInView ? "open" : "closed"}
                  key={index}
                  className="mr-[3px]"
                >
                  {word}
                </motion.span>
              </span>
            );
          })}
        </p>
        <motion.p
          variants={opacity}
          animate={isInView ? "open" : "closed"}
          className={cn(styles.p, "text-[18px]", "w-[80%]")}
        >
          The combination of my passion for design, code & interaction positions
          me in a unique place in the web design world.
        </motion.p>
        <div data-scroll data-scroll-speed={0.1}>
          <Rounded className={styles.button}>
            <p
              className={cn(
                "relative",
                "z-[1]",
                "transition-colors",
                "duration-400",
                "ease-linear",
                "hover:text-white"
              )}
            >
              About me
            </p>
          </Rounded>
        </div>
      </div>
    </section>
  );
}

// export default function About() {
//   const phrases = [
//     "Helping",
//     "brands to",
//     "stand out in",
//     "the digital",
//     "era.",
//     "Together we",
//     "will set the",
//     "new status",
//     "quo.",
//     "No nonsense,",
//     "always on",
//     "the cutting edge.",
//   ];
//   const description = useRef(null);
//   const isInView = useInView(description);

//   return (
//     <section ref={description} className={cn(styles.description)}>
//       <div className={cn(styles.container, "max-w-[1400px]")}>
//         <div className={styles.descriptionNew}>
//           {phrases.map((phrase, index) => {
//             return <AnimatedText key={index}>{phrase}</AnimatedText>;
//           })}
//         </div>
//         <motion.p
//           variants={opacity}
//           animate={isInView ? "open" : "closed"}
//           className={cn(styles.p, "text-[18px]", "w-[80%]")}
//         >
//           The combination of my passion for design, code & interaction positions
//           me in a unique place in the web design world.
//         </motion.p>
//         <div data-scroll data-scroll-speed={0.1}>
//           <Rounded className={styles.button}>
//             <p
//               className={cn(
//                 "relative",
//                 "z-[1]",
//                 "transition-colors",
//                 "duration-400",
//                 "ease-linear",
//                 "hover:text-white"
//               )}
//             >
//               About me
//             </p>
//           </Rounded>
//         </div>
//       </div>
//     </section>
//   );
// }

function AnimatedText({ children }) {
  const text = useRef(null);

  // useIsomorphicLayoutEffect(() => {
  //   gsap.registerPlugin(ScrollTrigger);
  //   gsap.from(text.current, {
  //     scrollTrigger: {
  //       trigger: text.current,
  //       scrub: true,
  //       start: "0px bottom",
  //       end: "bottom+=400px bottom",
  //     },
  //     opacity: 0,
  //     // left: "-200px",
  //     left: "-100px",
  //     ease: "power3.Out",
  //   });
  // }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(text.current, {
      scrollTrigger: {
        trigger: text.current,
        scrub: true,
        start: "0px bottom",
        end: "bottom+=400px bottom",
      },
      opacity: 0,
      left: "-200px",
      // left: "-100px",
      ease: "power3.Out",
    });
  }, []);

  return (
    <p className={cn(styles.p, "text-[36px]", "leading-[1.3]", "relative")}>
      {children}
    </p>
  );
}
