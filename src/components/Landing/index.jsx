"use client"

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

export default function Landing() {
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

      {/* <Container className={styles.sliderContainer}>
        <Slider text="Freelance Developer -" />
      </Container> */}
      <div className={styles.sliderContainer}>
        <Slider text="Freelance Developer -" />
      </div>

      <div data-scroll data-scroll-speed={1} className={styles.description}>
        <ArrowIcon className={styles.svg} width={18} height={18} fill="white" />
        <p className={styles.p}>Freelance</p>
        <p className={styles.p}>Designer & Developer</p>
      </div>
    </motion.div>
  );
}
