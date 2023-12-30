"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { menuSlide } from "../anim";
import Link from "./Link";
import Curve from "./Curve";
import Footer from "./Footer";
import styles from "./classnames";
import { routes } from "./routes";

export default function Nav() {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);
  console.log('pathname', pathname)

  return (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className={styles.menu}
    >
      <div className={styles.body}>
        <div
          onMouseLeave={() => {
            setSelectedIndicator(pathname);
          }}
          className={styles.nav}
        >
          <div className={styles.header}>
            <p>Navigation</p>
          </div>
          {routes.map((routes, index) => {
            if (pathname !== routes.href) {
              return (
                <Link
                  key={index}
                  data={{ ...routes, index }}
                  isActive={selectedIndicator == routes.href}
                  setSelectedIndicator={setSelectedIndicator}
                  className={styles.a}
                />
              );
            }
          })}
        </div>
        <Footer />
      </div>
      <Curve />
    </motion.div>
  );
}
