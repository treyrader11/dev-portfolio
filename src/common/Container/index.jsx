import { cn } from "@/lib/utils";
import styles from "./styles";

export default function Container({ classname, children, maxWidth, ref }) {
  return (
    <div ref={ref} className={classname} style={{ maxWidth }}>
      {children}
    </div>
  );
}
