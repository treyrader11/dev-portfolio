import React from "react";
import { motion } from "framer-motion";
// import Link from "next/link";
import { slide, opacity, perspective } from "./anim";
import styles from "./styles";

const anim = (variants) => {
  return {
    initial: "initial",
    animate: "enter",
    exit: "exit",
    variants,
  };
};

export default function Layout({ children }) {
  return (
    <div className="inner">
      <motion.div className={styles.slide} {...anim(slide)} />
      <motion.div className={styles.page} {...anim(perspective)}>
        <motion.div {...anim(opacity)}>
          {/* <div className="header">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div> */}
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
