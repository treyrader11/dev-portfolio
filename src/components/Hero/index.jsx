import Image from "next/image";
// import portrait from "/public/images/background.jpg";
import portraitGrey from "/public/images/portraits/coffee-portrait-grey.png";
import portraitGraySit from "/public/images/portraits/portrait-sit-graybg.png";
import portraitBlack from "/public/images/portraits/portrait-sit-blackbg.png";
import portraitfb from "/public/images/portraits/fbProfile.jpeg";
import portraitCoffee from "/public/images/portraits/coffeePortrait.jpeg";
import { slideUp } from "./anim";
import { motion } from "framer-motion";
import styles from "./styles";
import Slider from "@/common/Slider";
import ArrowIcon from "@/icons/Arrow";
import Container from "@/common/Container";
import { cn } from "@/lib/utils";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";

export default function Hero() {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);

  const xPercent = useRef(0);
  const direction = useRef(-1);

  const animate = useCallback(() => {
    if (xPercent.current < -100) {
      xPercent.current = 0;
    } else if (xPercent.current > 0) {
      xPercent.current = -100;
    }
    gsap.set(firstText.current, { xPercent: xPercent.current });
    gsap.set(secondText.current, { xPercent: xPercent.current });
    requestAnimationFrame(animate);
    xPercent.current += 0.1 * direction.current;
  }, [firstText, secondText, direction]);

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(slider.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.25,
        start: 0,
        end: window.innerHeight,
        onUpdate: (e) => (direction.current = e.direction * -1),
      },
      x: "-500px",
    });
    requestAnimationFrame(animate);
  }, [animate]);

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate="enter"
      className={styles.landing}
    >
      <Image
        // src={portraitBlack}
        src={portraitGrey}
        // src={portraitfb}
        // src={portraitGraySit}
        // src={portraitCoffee}
        fill={true}
        alt="background"
        priority
        className={"object-cover"}
      />

      {/* <Container className={cn(styles.sliderContainer, "bg-red-400")}>
        <Slider text="Freelance Developer -" />
      </Container> */}
      {/* <div className={cn(styles.sliderContainer)}>
        <Slider text="Freelance Developer -" fontSize={230} />
      </div> */}



      

      {/* Old slider */}
      <div className={cn(styles.sliderContainer)}>
        <div ref={slider} className={cn("relative", "whitespace-nowrap")}>
          <p
            ref={firstText}
            className={cn(
              "relative",
              "m-0",
              "text-white",
              "font-medium",
              "pr-[50px]",
              "text-6xl"
            )}
          >
            Freelance Developer -
          </p>
          <p
            ref={secondText}
            className={cn(
              "relative",
              "m-0",
              "text-white",
              "font-medium",
              "pr-[50px]",
              "text-6xl",
              "absolute",
              "top-0",
              "left-full"
            )}
          >
            Freelance Developer -
          </p>
        </div>
      </div>

      <div data-scroll data-scroll-speed={1} className={styles.description}>
        <ArrowIcon className={styles.svg} width={18} height={18} fill="white" />
        <p className={styles.p}>Freelance</p>
        <p className={styles.p}>Designer & Developer</p>
      </div>
    </motion.div>
  );
}
