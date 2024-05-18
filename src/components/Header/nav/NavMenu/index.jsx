"use client";

import styles from "./styles";
import Magnetic from "@/common/Magnetic";
import { routes } from "../routes";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NavMenu({ handleNavMenu, className }) {
  return (
    <nav className={cn(styles.nav, className)}>
      <div className="hidden sm:flex">
        {routes.map(({ label, href }) => {
          if (label !== "Home") {
            return (
              <Magnetic key={href}>
                <div className={styles.navItem}>
                  <Link href={href}>{label}</Link>
                  <div className={styles.indicator} />
                </div>
              </Magnetic>
            );
          } else {
            return;
          }
        })}
      </div>
      <Magnetic>
        <div
          onClick={handleNavMenu}
          className={cn(styles.navItem, "sm:hidden")}
        >
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
