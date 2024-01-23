"use client";

import styles from "./styles";
import Magnetic from "@/common/Magnetic";
import { routes } from "../nav/routes";
import Link from "next/link";

export default function NavMenu() {
  return (
    <nav className={styles.nav}>
      {routes.map(({ label, href }) => (
        <Magnetic key={href}>
          <div className={styles.navItem}>
            <Link href={href}>{label}</Link>
            <div className={styles.indicator}></div>
          </div>
        </Magnetic>
      ))}
    </nav>
  );
}
