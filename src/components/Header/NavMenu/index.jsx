// import { scrollTo } from "@/lib/utils";
import Link from "next/link";
import styles from "./styles";
import Magnetic from "@/common/Magnetic";
import { routes } from "../nav/routes";

export default function NavMenu({ className, currentPage }) {
  return (
    <nav className={className}>
      {routes.map(({ label, href }) => (
        // <Magnetic key={href} onClick={() => scrollTo(label)}>
        <Magnetic key={href}>
          <div className={styles.el}>
            <Link href={href}>{label}</Link>
            {/* <a>{label}</a> */}
            <div className={styles.indicator}></div>
          </div>
        </Magnetic>
      ))}
    </nav>
  );
}
