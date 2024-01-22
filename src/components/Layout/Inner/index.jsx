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

export default function Inner({ children, className, backgroundColor }) {
  return (
    <div className={styles.inner({ className })} style={{ backgroundColor }}>
      <motion.div className={styles.slide} {...anim(slide)} />
      <motion.div className={styles.page} {...anim(perspective)}>
        <motion.div {...anim(opacity)}>
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}