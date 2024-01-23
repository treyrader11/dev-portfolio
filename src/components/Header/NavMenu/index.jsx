"use client";

import styles from "./styles";
import Magnetic from "@/common/Magnetic";
import { routes } from "../nav/routes";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NavMenu({ handleNavMenu }) {
  return (
    <nav className={styles.nav}>
      <div className="hidden sm:flex">
        {routes.map(({ label, href }) => (
          <Magnetic key={href}>
            <div className={styles.navItem}>
              <Link href={href}>{label}</Link>
              <div className={styles.indicator} />
            </div>
          </Magnetic>
        ))}
      </div>
      <Magnetic>
        <div onClick={handleNavMenu} className={cn(styles.navItem, "sm:hidden")}>
          <Link href="#">Menu</Link>
          <div
            className={cn(
              styles.indicator,
              "scale-100",
              "top-[26px]",
              "left-0"
            )}
          />
        </div>
      </Magnetic>
    </nav>
  );
}
