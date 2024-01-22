import styles from "./styles";
import { cn } from "@/lib/utils";

export default function Logo({ className }) {
  return (
    <div className={cn(styles.logo, className)}>
      <p className={cn(styles.p, styles.copyright)}>©</p>
      <div className={styles.name}>
        <p className={cn(styles.p, styles.p2, styles.codeBy)}>Code by</p>
        <p className={cn(styles.p, styles.p2, "pl-[0.3em]", styles.trey)}>
          Trey
        </p>
        <p
          className={cn(
            styles.p,
            styles.p2,
            "absolute left-[117px]",
            styles.rader
          )}
        >
          Rader
        </p>
      </div>
    </div>
  );
}
