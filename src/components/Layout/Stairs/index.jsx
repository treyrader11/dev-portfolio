"use client";

import { motion } from "framer-motion";
import { opacity, expand } from "./anim";
import styles from "./styles";

export default function Stairs({ children, backgroundColor }) {
  const anim = (variants, custom = null) => {
    return {
      initial: "initial",
      animate: "enter",
      exit: "exit",
      custom,
      variants,
    };
  };

  const nbOfColumns = 5;
  return (
    <div className="page stairs" style={{ backgroundColor }}>
      <motion.div {...anim(opacity)} className={styles.background} />
      <div className={styles.container}>
        {[...Array(nbOfColumns)].map((_, i) => {
          return (
            <motion.div
              className={styles.div}
              key={i}
              {...anim(expand, nbOfColumns - i)}
            />
          );
        })}
      </div>
      {children}
    </div>
  );
}
