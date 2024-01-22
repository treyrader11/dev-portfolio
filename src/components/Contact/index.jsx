"use client";

import { useRef } from "react";
import { useScroll, motion, useTransform } from "framer-motion";
import Rounded from "@/common/Rounded";
import Magnetic from "@/common/Magnetic";
import Container from "@/common/Container";
import styles from "./styles";
import profilePicture from "/public/images/portraits/coffee-portrait-grey.png";
import ProfilePicture from "@/common/ProfilePicture";

export default function Contact() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y = useTransform(scrollYProgress, [0, 1], [-500, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [120, 90]);
  return (
    <motion.div
      style={{ y }}
      ref={container}
      id="contact"
      className={styles.contact}
    >
      <Container maxWidth={1800} classname={styles.container}>
        <div className={styles.title}>
          <span className="flex items-center">
            <ProfilePicture src={profilePicture} />
            <h2 className="ml-[0.3em]">Let&apos;s work</h2>
          </span>
          <h2 className="text-[5vw] m-0 font-light">together</h2>
          <motion.div style={{ x }} className={styles.buttonContainer}>
            <Rounded backgroundColor={"#334BD3"} className={styles.button}>
              <p>Get in touch</p>
            </Rounded>
          </motion.div>
          <motion.svg
            style={{ rotate, scale: 2 }}
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 8.5C8.27614 8.5 8.5 8.27614 8.5 8L8.5 3.5C8.5 3.22386 8.27614 3 8 3C7.72386 3 7.5 3.22386 7.5 3.5V7.5H3.5C3.22386 7.5 3 7.72386 3 8C3 8.27614 3.22386 8.5 3.5 8.5L8 8.5ZM0.646447 1.35355L7.64645 8.35355L8.35355 7.64645L1.35355 0.646447L0.646447 1.35355Z"
              fill="white"
            />
          </motion.svg>
        </div>
        <div className={styles.nav}>
          <Rounded>
            <p>info@treyrader.com</p>
          </Rounded>
          <Rounded>
            <p>504.756.4538</p>
          </Rounded>
        </div>
        <div className={styles.info}>
          <div className="flex gap-[10px] items-end">
            <span className={styles.span}>
              <h3 className={styles.infoHeading}>Placeholder</h3>
              <p className={styles.infoText}>2023 © Edition</p>
            </span>
            <span className={styles.span}>
              <h3 className={styles.infoHeading}>Placeholder</h3>
              <p className={styles.infoText}>placeholder</p>
            </span>
          </div>
          <div>
            <span className={styles.span}>
              <h3 className={styles.infoHeading}>socials</h3>
              <Magnetic>
                <p className={styles.infoText}>Github</p>
              </Magnetic>
            </span>
            <Magnetic>
              <p className={styles.infoText}>Youtube</p>
            </Magnetic>
            <Magnetic>
              <p className={styles.infoText}>Instagram</p>
            </Magnetic>
            <Magnetic>
              <p className={styles.infoText}>Linkedin</p>
            </Magnetic>
          </div>
        </div>
      </Container>
    </motion.div>
  );
}
