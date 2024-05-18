// "use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { text, curve, translate } from "./anim";
import styles from "./styles";
import { cn } from "@/lib/utils";
// import { routes } from "@/components/Header/nav/routes";

const routes = {
  "/": "Home",
  "/about": "About",
  "/contact": "Contact",
};

const anim = (variants) => {
  return {
    variants,
    initial: "initial",
    animate: "enter",
    exit: "exit",
  };
};

export default function Curve({ children, backgroundColor, className }) {
  const router = useRouter();
  const [dimensions, setDimensions] = useState({
    width: null,
    height: null,
  });

  useEffect(() => {
    function resize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className={cn(styles.curve, className)} style={{ backgroundColor }}>
      <div
        style={{ opacity: dimensions.width == null ? 1 : 0 }}
        className={styles.background}
      />
      <motion.p className={styles.route} {...anim(text)}>
        {routes[router.route]}
      </motion.p>
      {dimensions.width != null && <SVG {...dimensions} />}
      {children}
    </div>
  );
}

function SVG({ height, width }) {
  if (width == null || height == null) {
    return null;
  }
  const initialPath = `
        M0 300
        Q${width / 2} 0 ${width} 300
        L${width} ${height + 300}
        Q${width / 2} ${height + 600} 0 ${height + 300}
        L0 0
    `;

  const targetPath = `
    M0 300
    Q${width / 2} 0 ${width} 300
    L${width} ${height}
    Q${width / 2} ${height} 0 ${height}
    L0 0
`;

  return (
    <motion.svg {...anim(translate)} className={styles.background}>
      <motion.path {...anim(curve(initialPath, targetPath))} />
    </motion.svg>
  );
}
